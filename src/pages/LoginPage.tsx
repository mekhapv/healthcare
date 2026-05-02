import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, googleProvider, hasFirebaseConfig } from '../services/firebase';
import { useAppStore } from '../store/appStore';

export function LoginPage() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
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

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid work email.');
      return;
    }

    setLoading(true);

    try {
      if (hasFirebaseConfig && auth) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName ?? 'Care Manager',
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (email !== 'demo@careops.io' || password !== 'CareOps@123') {
          throw new Error('Use demo@careops.io / CareOps@123 for local demo mode.');
        }
        setUser({
          uid: 'demo-user',
          email,
          displayName: 'Care Manager',
        });
      }

      navigate('/', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed.');
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
      const credential = await signInWithPopup(auth, googleProvider);
      setUser({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName ?? 'Care Manager',
      });
      navigate('/', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Google sign in failed.');
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
          <h1>Sign in to your care command center</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <div className="input-shell">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                name="careops-email"
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button full-width" type="submit" disabled={loading}>
            <ShieldCheck size={17} />
            {loading ? 'Signing in...' : 'Sign in'}
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
