import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/layout';
import Home from '@/pages/home';
import Services from '@/pages/services';
import Quote from '@/pages/quote';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminClients from '@/pages/admin/clients';
import AdminReminders from '@/pages/admin/reminders';
import AdminCampaigns from '@/pages/admin/campaigns';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        {/* Admin Routes */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/reminders" component={AdminReminders} />
        <Route path="/admin/campaigns" component={AdminCampaigns} />
        
        {/* Public Routes with Layout */}
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
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
