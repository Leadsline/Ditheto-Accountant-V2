import { lazy, Suspense } from 'react';
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

function AuthenticationRemovedNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ditheto Admin Portal
        </p>
        <h1 className="mt-3 text-2xl font-bold text-secondary">
          Authentication is disabled
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          The admin portal is available as a public preview while replacement
          access control is prepared.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary"
        >
          Open admin preview
        </Link>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route path="/sign-in/*?" component={AuthenticationRemovedNotice} />
        <Route path="/sign-up/*?" component={AuthenticationRemovedNotice} />
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
        <Route component={AuthenticationRemovedNotice} />
      </Switch>
    </Suspense>
  );
}