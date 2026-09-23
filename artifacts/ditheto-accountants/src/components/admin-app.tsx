import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch } from 'wouter';

const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminClients = lazy(() => import('@/pages/admin/clients'));
const AdminClientProfile = lazy(() => import('@/pages/admin/client-profile'));
const AdminIntegrations = lazy(() => import('@/pages/admin/integrations'));
const AdminReminders = lazy(() => import('@/pages/admin/reminders'));
const AdminCampaigns = lazy(() => import('@/pages/admin/campaigns'));
const AdminTeam = lazy(() => import('@/pages/admin/team'));

function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
        aria-label="Loading page"
      />
    </div>
  );
}

async function readApiBody(response: Response): Promise<{ error?: string; message?: string }> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as { error?: string; message?: string };
  } catch {
    return { error: text.slice(0, 240) || `Server error (${response.status}).` };
  }
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetting, setResetting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const body = await readApiBody(response);
      if (!response.ok) throw new Error(body.error ?? 'Unable to sign in.');
      window.location.assign('/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function requestPasswordReset() {
    if (!email.includes('@')) {
      setError('Enter your email address first.');
      return;
    }
    setResetting(true);
    setError('');
    setResetMessage('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const body = await readApiBody(response);
      if (!response.ok) throw new Error(body.error ?? 'Unable to request a password reset.');
      setResetMessage(body.message ?? 'If that email is registered, a password reset link has been sent.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to request a password reset.');
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ditheto Admin Portal
        </p>
        <h1 className="mt-3 text-2xl font-bold text-secondary">Super Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Sign in to manage the Ditheto admin portal.
        </p>
        <label className="mt-6 block text-sm font-semibold text-secondary">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-secondary">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {resetMessage && <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{resetMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={requestPasswordReset}
          disabled={resetting}
          className="mt-4 w-full text-sm font-semibold text-primary transition-colors hover:text-secondary disabled:opacity-60"
        >
          {resetting ? 'Sending reset link…' : 'Forgot password?'}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-primary hover:text-secondary">
          Return to website
        </Link>
      </form>
    </div>
  );
}

function ResetPasswordScreen() {
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const callbackError = hash.get('error_description') ?? query.get('error_description');
    const accessToken = hash.get('access_token') ?? query.get('access_token');

    if (callbackError) {
      setError(callbackError);
    } else if (accessToken && (hash.get('type') === 'recovery' || query.get('type') === 'recovery')) {
      setRecoveryToken(accessToken);
    } else {
      setError('This password reset link is missing a recovery token. Request a new reset link.');
    }

    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!recoveryToken) {
      setError('This password reset link is invalid or has expired. Request a new reset link.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Your new password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accessToken: recoveryToken, password: newPassword }),
      });
      const body = await readApiBody(response);
      if (!response.ok) throw new Error(body.error ?? 'Unable to update your password.');
      setRecoveryToken('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(body.message ?? 'Your password has been updated. You can now sign in.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to update your password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Ditheto Admin Portal</p>
        <h1 className="mt-3 text-2xl font-bold text-secondary">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Choose a new password for your Ditheto admin account.
        </p>
        <label className="mt-6 block text-sm font-semibold text-secondary">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={!recoveryToken}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-secondary">
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={!recoveryToken}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
          />
        </label>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}
        <button
          type="submit"
          disabled={submitting || !recoveryToken}
          className="mt-6 w-full rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {submitting ? 'Updating password…' : 'Update password'}
        </button>
        <Link href="/sign-in" className="mt-4 block text-center text-sm font-semibold text-primary hover:text-secondary">
          Return to sign in
        </Link>
      </form>
    </div>
  );
}

function AdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'checking' | 'authenticated' | 'signed-out'>('checking');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((response) => setState(response.ok ? 'authenticated' : 'signed-out'))
      .catch(() => setState('signed-out'));
  }, []);

  if (state === 'checking') return <RouteLoading />;
  if (state === 'signed-out') return <LoginScreen />;
  return <>{children}</>;
}

function ProtectedAdminRoutes() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminDashboard />
      </Route>
      <Route path="/admin/clients">
        <AdminClients />
      </Route>
      <Route path="/admin/clients/:clientId">
        <AdminClientProfile />
      </Route>
      <Route path="/admin/settings/integrations">
        <AdminIntegrations />
      </Route>
      <Route path="/admin/reminders">
        <AdminReminders />
      </Route>
      <Route path="/admin/campaigns">
        <AdminCampaigns />
      </Route>
      <Route path="/admin/team">
        <AdminTeam />
      </Route>
      <Route component={LoginScreen} />
    </Switch>
  );
}

export default function AdminApp() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route path="/admin/reset-password" component={ResetPasswordScreen} />
        <Route path="/sign-in/*?" component={LoginScreen} />
        <Route path="/sign-up/*?" component={LoginScreen} />
        <Route path="/" component={ResetPasswordScreen} />
        <Route component={() => <AdminGate><ProtectedAdminRoutes /></AdminGate>} />
      </Switch>
    </Suspense>
  );
}