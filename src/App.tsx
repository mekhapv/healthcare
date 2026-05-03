import { onAuthStateChanged, signOut } from 'firebase/auth';
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { auth } from './services/firebase';
import { useAppStore } from './store/appStore';

const SESSION_DURATION_MS = 30 * 60 * 1000;

const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })),
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const PatientDetailsPage = lazy(() =>
  import('./pages/PatientDetailsPage').then((module) => ({
    default: module.PatientDetailsPage,
  })),
);

export default function App() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const firebaseAuth = auth;

    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      const currentUser = useAppStore.getState().user;

      if (firebaseUser && currentUser?.uid === firebaseUser.uid && currentUser.expiresAt <= Date.now()) {
        void signOut(firebaseAuth);
        setUser(null);
        return;
      }

      setUser(
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName ?? 'Care Manager',
              expiresAt:
                currentUser?.uid === firebaseUser.uid && currentUser.expiresAt
                  ? currentUser.expiresAt
                  : Date.now() + SESSION_DURATION_MS,
            }
          : null,
      );
    });
  }, [setUser]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const endSession = () => {
      if (auth) {
        void signOut(auth);
      }
      setUser(null);
      window.alert('You are signed out.');
    };

    const remainingSessionMs = user.expiresAt - Date.now();

    if (remainingSessionMs <= 0) {
      endSession();
      return undefined;
    }

    const timeoutId = window.setTimeout(endSession, remainingSessionMs);
    return () => window.clearTimeout(timeoutId);
  }, [setUser, user]);

  return (
    <Suspense fallback={<div className="route-loader">Loading workspace...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="patients" element={<PatientDetailsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
