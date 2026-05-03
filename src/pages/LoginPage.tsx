import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';
import { LockKeyhole, Mail, ShieldCheck, User, UserPlus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, googleProvider, hasFirebaseConfig } from '../services/firebase';
import { useAppStore } from '../store/appStore';

const SESSION_DURATION_MS = 30 * 60 * 1000;

const getFirebaseAuthErrorMessage = (error: unknown, fallback: string) => {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (error.code === 'auth/unauthorized-domain') {
    return 'Google sign in is not enabled for this domain. Add your deployed site domain in Firebase Authentication > Settings > Authorized domains.';
  }

  if (error.code === 'auth/popup-blocked') {
    return 'The Google sign in popup was blocked. Allow popups for this site or try again.';
  }

  if (error.code === 'auth/popup-closed-by-user') {
    return 'Google sign in was closed before it finished.';
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'This sign in method is not enabled in Firebase Authentication. Enable it under Sign-in providers.';
  }

  if (error.code === 'auth/email-already-in-use') {
    return 'An account already exists for this email. Use Sign in instead.';
  }

  if (error.code === 'auth/weak-password') {
    return 'Use a stronger password with at least 6 characters.';
  }

  if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
    return 'No matching account was found. Check your details or create a new account.';
  }

  return error.message || fallback;
};

const shouldFallbackToRedirect = (error: unknown) =>
  error instanceof FirebaseError &&
  ['auth/popup-blocked', 'auth/cancelled-popup-request', 'auth/operation-not-supported-in-this-environment'].includes(
    error.code,
  );

export function LoginPage() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (authMode === 'sign-up' && !displayName.trim()) {
      setError('Name is required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid work email.');
      return;
    }

    setLoading(true);

    try {
      if (hasFirebaseConfig && auth) {
        const credential =
          authMode === 'sign-up'
            ? await createUserWithEmailAndPassword(auth, email, password)
            : await signInWithEmailAndPassword(auth, email, password);

        if (authMode === 'sign-up') {
          await updateProfile(credential.user, {
            displayName: displayName.trim(),
          });
        }

        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: (credential.user.displayName ?? displayName.trim()) || 'Care Manager',
          expiresAt: Date.now() + SESSION_DURATION_MS,
        });
      } else {
        if (authMode === 'sign-up') {
          throw new Error('Sign up needs Firebase environment variables configured.');
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        if (email !== 'demo@careops.io' || password !== 'CareOps@123') {
          throw new Error('Use demo@careops.io / CareOps@123 for local demo mode.');
        }
        setUser({
          uid: 'demo-user',
          email,
          displayName: 'Care Manager',
          expiresAt: Date.now() + SESSION_DURATION_MS,
        });
      }

      navigate('/', { replace: true });
    } catch (caughtError) {
      setError(
        getFirebaseAuthErrorMessage(
          caughtError,
          authMode === 'sign-up' ? 'Sign up failed.' : 'Login failed.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');

    if (!hasFirebaseConfig || !auth || !googleProvider) {
      setError('Google sign in needs Firebase environment variables configured.');
      return;
    }

    setGoogleLoading(true);

    try {
      let credential;

      try {
        credential = await signInWithPopup(auth, googleProvider);
      } catch (popupError) {
        if (!shouldFallbackToRedirect(popupError)) {
          throw popupError;
        }

        await signInWithRedirect(auth, googleProvider);
        return;
      }

      setUser({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName ?? 'Care Manager',
        expiresAt: Date.now() + SESSION_DURATION_MS,
      });
      navigate('/', { replace: true });
    } catch (caughtError) {
      setError(getFirebaseAuthErrorMessage(caughtError, 'Google sign in failed.'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>CareOps Cloud</strong>
            <span>Healthcare operations workspace</span>
          </div>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Secure access</p>
          <h1>{authMode === 'sign-up' ? 'Create your care command account' : 'Sign in to your care command center'}</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="auth-mode-toggle" role="tablist" aria-label="Authentication options">
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'sign-in'}
              className={authMode === 'sign-in' ? 'active' : ''}
              onClick={() => {
                setAuthMode('sign-in');
                setDisplayName('');
                setEmail('');
                setPassword('');
                setError('');
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'sign-up'}
              className={authMode === 'sign-up' ? 'active' : ''}
              onClick={() => {
                setAuthMode('sign-up');
                setDisplayName('');
                setEmail('');
                setPassword('');
                setError('');
              }}
            >
              Sign up
            </button>
          </div>

          {authMode === 'sign-up' ? (
            <label>
              <span>Name</span>
              <div className="input-shell">
                <User size={17} aria-hidden="true" />
                <input
                  type="text"
                  name="careops-new-user-name"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <div className="input-shell">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                name="careops-email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-shell">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                type="password"
                name="careops-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button full-width" type="submit" disabled={loading}>
            {authMode === 'sign-up' ? <UserPlus size={17} /> : <ShieldCheck size={17} />}
            {loading ? (authMode === 'sign-up' ? 'Creating account...' : 'Signing in...') : authMode === 'sign-up' ? 'Sign up' : 'Sign in'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="google-button full-width"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            <img className="google-mark" src="/google logo.png" alt="" aria-hidden="true" />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
        </form>
      </section>
    </main>
  );
}
