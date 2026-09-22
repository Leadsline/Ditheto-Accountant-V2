import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const Layout = lazy(() =>
  import('@/components/layout/layout').then(({ Layout }) => ({ default: Layout })),
);
const AdminApp = lazy(() => import('@/components/admin-app'));

const Home = lazy(() => import('@/pages/home'));
const Services = lazy(() => import('@/pages/services'));
const ServiceDetail = lazy(() => import('@/pages/service-detail'));
const Quote = lazy(() => import('@/pages/quote'));
const About = lazy(() => import('@/pages/about'));
const Team = lazy(() => import('@/pages/team'));
const Contact = lazy(() => import('@/pages/contact'));
const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminClients = lazy(() => import('@/pages/admin/clients'));
const AdminClientProfile = lazy(() => import('@/pages/admin/client-profile'));
const AdminIntegrations = lazy(() => import('@/pages/admin/integrations'));
const AdminReminders = lazy(() => import('@/pages/admin/reminders'));
const AdminCampaigns = lazy(() => import('@/pages/admin/campaigns'));
const AdminTeam = lazy(() => import('@/pages/admin/team'));
const NotFound = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function PublicRouter() {
  return (
    <Switch>
      {/* Public Routes with Layout */}
      <Route path="/services/:serviceId">
        <Layout>
          <ServiceDetail />
        </Layout>
      </Route>
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/:rest*">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/services" component={Services} />
            <Route path="/quote" component={Quote} />
            <Route path="/about" component={About} />
            <Route path="/team" component={Team} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-label="Loading page" />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [location] = useLocation();
  const isAdminRoute =
    location === '/sign-in' ||
    location.startsWith('/sign-in/') ||
    location === '/sign-up' ||
    location.startsWith('/sign-up/') ||
    location === '/admin' ||
    location.startsWith('/admin/');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RoutedErrorBoundary>
          <Suspense fallback={<RouteLoading />}>
            {isAdminRoute ? (
              <AdminApp />
            ) : (
              <PublicRouter />
            )}
          </Suspense>
        </RoutedErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default function AppRoot() {
  return <WouterRouter base={basePath}><App /></WouterRouter>;
}