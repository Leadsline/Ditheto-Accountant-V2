import { lazy, Suspense, type ReactNode, useEffect, useRef } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Redirect, Route, Switch, useLocation } from 'wouter';
import { useRole } from '@/hooks/use-role';

const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminClients = lazy(() => import('@/pages/admin/clients'));
const AdminClientProfile = lazy(() => import('@/pages/admin/client-profile'));
const AdminIntegrations = lazy(() => import('@/pages/admin/integrations'));
const AdminReminders = lazy(() => import('@/pages/admin/reminders'));
const AdminCampaigns = lazy(() => import('@/pages/admin/campaigns'));
const AdminTeam = lazy(() => import('@/pages/admin/team'));

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const configuredClerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
// A Vercel deployment can be configured with the development Clerk key while
// it is being prepared. Clerk rejects that key through the production proxy
// with `host_invalid`; let the development instance use its direct FAPI until
// a live key is supplied. Replit production keys remain proxied.
const clerkProxyUrl = clerkPubKey.startsWith('pk_test_')
  ? ''
  : configuredClerkProxyUrl;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

function AdminGuard({
  children,
  fullAccess = false,
}: {
  children: ReactNode;
  fullAccess?: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const {
    isLoaded: roleLoaded,
    isFullAccess,
    isMarketingOnly,
    isUnauthorized,
  } = useRole();
  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  if (!roleLoaded) return <div className="min-h-screen bg-gray-50" />;
  if (isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Ditheto Admin Portal
          </p>
          <h1 className="mt-3 text-2xl font-bold text-secondary">
            Access is being set up
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your sign-in is working, but this account has not been assigned a
            staff portal role yet.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary"
          >
            Return to website
          </a>
        </div>
      </div>
    );
  }
  if (fullAccess && !isFullAccess) return <Redirect to="/admin/campaigns" />;
  if (!fullAccess && isMarketingOnly) return <>{children}</>;
  return <>{children}</>;
}

function ClerkQueryInvalidator({ queryClient }: { queryClient: QueryClient }) {
  const { addListener } = useClerk();
  const previous = useRef<string | null | undefined>(undefined);
  useEffect(
    () =>
      addListener(({ user }) => {
        const userId = user?.id ?? null;
        if (previous.current !== undefined && previous.current !== userId) {
          queryClient.clear();
        }
        previous.current = userId;
      }),
    [addListener, queryClient],
  );
  return null;
}

function AuthRouter() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route
          path="/sign-in/*?"
          component={() => (
            <div className="flex min-h-screen items-center justify-center bg-background">
              <SignIn
                routing="path"
                path={`${basePath}/sign-in`}
                signUpUrl={`${basePath}/sign-up`}
                forceRedirectUrl={`${basePath}/admin/clients`}
              />
            </div>
          )}
        />
        <Route
          path="/sign-up/*?"
          component={() => (
            <div className="flex min-h-screen items-center justify-center bg-background">
              <SignUp
                routing="path"
                path={`${basePath}/sign-up`}
                signInUrl={`${basePath}/sign-in`}
                forceRedirectUrl={`${basePath}/admin/clients`}
              />
            </div>
          )}
        />
        <Route path="/admin">
          <AdminGuard fullAccess>
            <AdminDashboard />
          </AdminGuard>
        </Route>
        <Route path="/admin/clients">
          <AdminGuard fullAccess>
            <AdminClients />
          </AdminGuard>
        </Route>
        <Route path="/admin/clients/:clientId">
          <AdminGuard fullAccess>
            <AdminClientProfile />
          </AdminGuard>
        </Route>
        <Route path="/admin/settings/integrations">
          <AdminGuard fullAccess>
            <AdminIntegrations />
          </AdminGuard>
        </Route>
        <Route path="/admin/reminders">
          <AdminGuard fullAccess>
            <AdminReminders />
          </AdminGuard>
        </Route>
        <Route path="/admin/campaigns">
          <AdminGuard>
            <AdminCampaigns />
          </AdminGuard>
        </Route>
        <Route path="/admin/team">
          <AdminGuard fullAccess>
            <AdminTeam />
          </AdminGuard>
        </Route>
      </Switch>
    </Suspense>
  );
}

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

export default function AuthenticatedApp({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      appearance={{
        theme: shadcn,
        cssLayerName: 'clerk',
        elements: {
          socialButtonsBlockButton: 'hidden',
        },
        variables: {
          colorPrimary: '#008E8A',
          colorForeground: '#17324D',
          colorBackground: '#FFFFFF',
          colorInput: '#F7FAFC',
          colorInputForeground: '#17324D',
          colorMutedForeground: '#64748B',
          fontFamily: 'DM Sans, sans-serif',
          borderRadius: '0.75rem',
        },
      }}
      localization={{
        signIn: {
          start: {
            title: 'Ditheto Admin Portal',
            subtitle:
              'Use your email address and password to manage client records securely',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryInvalidator queryClient={queryClient} />
      <AuthRouter />
    </ClerkProvider>
  );
}