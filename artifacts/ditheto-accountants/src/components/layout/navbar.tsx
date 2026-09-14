import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, Mail, X, ArrowUpRight } from "lucide-react";
import logo from "@assets/logo_1789318782052.png";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary/10 bg-background/95 shadow-[0_8px_30px_-24px_hsl(var(--secondary))] backdrop-blur-xl">
      <div className="hidden bg-secondary px-4 py-2.5 text-[11px] text-white md:block">
        <div className="site-container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone className="h-3 w-3 text-accent" /> Pretoria 067 765 7387 · Secunda 071 478 1810</span>
            <span className="flex items-center gap-2 text-white/70"><Mail className="h-3 w-3 text-accent" /> admin@dithetoaccountants.co.za</span>
          </div>
          <span className="font-bold uppercase tracking-[.18em] text-accent">Integrity you can count on</span>
        </div>
      </div>
      <div className="site-container">
        <div className="flex h-[78px] items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src={logo} alt="Ditheto Accountants" className="h-10 w-auto mix-blend-multiply" />
            </Link>
          </div>
           <nav className="hidden items-center space-x-7 md:flex">
            {links.map((link) => {
              const active = link.href === "/" ? location === "/" : location.startsWith(link.href);
              return <Link key={link.href} href={link.href} className={`relative py-2 text-sm font-semibold transition-colors ${active ? "text-primary" : "text-secondary/75 hover:text-primary"}`} data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}>
                {link.label}
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-accent transition-transform ${active ? "scale-x-100" : "scale-x-0"}`} />
              </Link>;
            })}
            <Link href="/quote" className="button-shine inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_-12px_hsl(var(--primary))] transition-transform hover:-translate-y-0.5" data-testid="link-nav-quote">Request a quote <ArrowUpRight className="h-4 w-4" /></Link>
          </nav>
          
           <div className="flex items-center gap-2 md:hidden">
             <Link href="/quote" className="rounded-sm bg-primary px-4 py-2 text-sm font-bold text-white" data-testid="link-mobile-quote">Quote</Link>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-md p-2 text-secondary" aria-label={menuOpen ? "Close menu" : "Open menu"} data-testid="button-mobile-menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
         {menuOpen && <nav className="border-t border-secondary/10 py-3 md:hidden">
           {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block border-b border-secondary/5 px-3 py-3 text-sm font-semibold text-secondary hover:bg-primary/5 hover:text-primary" data-testid={`link-mobile-${link.label.toLowerCase().replace(" ", "-")}`}>{link.label}</Link>)}
        </nav>}
      </div>
    </header>
  );
}
