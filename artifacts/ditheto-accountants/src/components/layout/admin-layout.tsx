import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, CalendarClock, Megaphone, LogOut, Bell } from "lucide-react";
import logo from "@assets/logo_1789318782052.png";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/clients", label: "Client Database", icon: Users },
    { path: "/admin/reminders", label: "Reminders", icon: CalendarClock },
    { path: "/admin/campaigns", label: "Marketing / Posters", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-4 border-b border-white/10 h-20 flex items-center justify-center bg-white">
          <img src={logo} alt="Ditheto" className="h-10 object-contain" />
        </div>
        
        <div className="px-4 py-6 font-semibold text-xs uppercase tracking-wider text-gray-400">
          Staff Portal Preview
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/">
            <button className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors w-full">
              <LogOut className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-sm">Exit to Website</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-heading font-bold text-secondary">
            {navItems.find(i => i.path === location)?.label || "Admin"}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
              UI PREVIEW ONLY - NO BACKEND
            </div>
            <button className="relative p-2 text-gray-400 hover:text-secondary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                SA
              </div>
              <div className="text-sm">
                <p className="font-bold text-secondary">System Admin</p>
                <p className="text-gray-500 text-xs">Pretoria Branch</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
