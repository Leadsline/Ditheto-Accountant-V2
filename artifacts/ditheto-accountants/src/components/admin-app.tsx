import { Link } from 'wouter';

function AdminComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ditheto Admin Portal
        </p>
        <h1 className="mt-3 text-2xl font-bold text-secondary">
          Admin portal coming soon
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We’re preparing a new administration experience for the Ditheto team.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary"
        >
          Return to website
        </Link>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return <AdminComingSoon />;
}