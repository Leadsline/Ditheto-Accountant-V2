import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, CalendarClock, Megaphone, Bell, UserRoundCog, Settings } from "lucide-react";
import logo from "@assets/logo_1789318782052.png";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/clients", label: "Client Database", icon: Users },
    { path: "/admin/reminders", label: "Reminders", icon: CalendarClock },
    { path: "/admin/campaigns", label: "Marketing / Posters", icon: Megaphone },
    { path: "/admin/team", label: "Team & Organogram", icon: UserRoundCog },
    { path: "/admin/settings/integrations", label: "Integrations", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-secondary text-white flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-4 border-b border-white/10 h-20 flex items-center justify-center bg-white">
          <img src={logo} alt="Ditheto" className="h-10 object-contain" />
        </div>

        <div className="px-4 py-6 font-semibold text-xs uppercase tracking-wider text-gray-400">
          Admin Preview
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isCurrent =
              location === item.path ||
              (item.path === "/admin/clients" && location.startsWith("/admin/clients")) ||
              (item.path === "/admin/settings/integrations" && location.startsWith("/admin/settings"));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isCurrent ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isCurrent ? "text-white" : "text-gray-400"}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs leading-5 text-gray-400">
          Authentication is disabled while the portal is being prepared.
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-heading font-bold text-secondary">
            {navItems.find((item) => location.startsWith(item.path))?.label || "Admin"}
          </h2>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-secondary transition-colors cursor-pointer" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                A
              </div>
              <div className="text-sm">
                <p className="font-bold text-secondary">Admin Preview</p>
                <p className="text-gray-500 text-xs">Public access</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}