import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Facebook, Instagram, Linkedin, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import logo from "@assets/Logo_1789472037430.png";

const socialLinks = [
  { href: "https://www.facebook.com/", label: "Facebook", icon: Facebook },
  { href: "https://www.instagram.com/", label: "Instagram", icon: Instagram },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: Linkedin },
  { href: "https://wa.me/27677657387", label: "WhatsApp", icon: MessageCircle },
];

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="w-full">
      <div className="bg-secondary px-4 py-2 text-[10px] text-white sm:py-2.5 sm:text-[11px]">
        <div className="site-container flex min-h-5 items-center gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <a href="tel:+27127513200" className="flex shrink-0 items-center gap-2 transition-colors hover:text-accent">
              <Phone className="h-3 w-3 text-accent" />
              <span>Pretoria 012 751 3200</span>
            </a>
            <a href="mailto:admin@dithetoaccountants.co.za" className="hidden items-center gap-2 text-white/70 transition-colors hover:text-white md:flex">
              <Mail className="h-3 w-3 text-accent" /> admin@dithetoaccountants.co.za
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-secondary/10 bg-background/95 shadow-[0_8px_30px_-24px_hsl(var(--secondary))] backdrop-blur-xl">
        <div className="site-container">
        <div className="flex h-[78px] items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
               <img src={logo} alt="Ditheto Accountants" className="h-11 w-auto mix-blend-multiply sm:h-12" />
            </Link>
          </div>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {links.map((link) => {
              const active = link.href === "/" ? location === "/" : location.startsWith(link.href);
               return <Link
                 key={link.href}
                 href={link.href}
                 aria-current={active ? "page" : undefined}
                 className={`relative rounded-sm px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                   active
                     ? "bg-primary/10 text-primary shadow-[inset_0_-2px_0_hsl(var(--accent))]"
                     : "text-secondary/75 hover:bg-primary/5 hover:text-primary"
                 }`}
                 data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}
               >
                {link.label}
              </Link>;
            })}
             <div className="ml-2 flex items-center gap-1 border-l border-secondary/15 pl-3">
               {socialLinks.map(({ href, label, icon: Icon }) => (
                 <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="flex h-9 w-9 items-center justify-center rounded-full text-secondary/65 transition-colors hover:bg-primary/10 hover:text-primary">
                   <Icon className="h-4 w-4" />
                 </a>
               ))}
             </div>
          </nav>
          
            <div className="flex items-center gap-1 md:hidden">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary/65 transition-colors hover:bg-primary/10 hover:text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-md p-2 text-secondary" aria-label={menuOpen ? "Close menu" : "Open menu"} data-testid="button-mobile-menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
          {menuOpen && <nav className="border-t border-secondary/10 py-3 md:hidden" aria-label="Mobile navigation">
            {links.map((link) => {
              const active = link.href === "/" ? location === "/" : location.startsWith(link.href);
              return <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-secondary/5 px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "border-l-2 border-l-primary bg-primary/10 text-primary"
                    : "text-secondary hover:bg-primary/5 hover:text-primary"
                }`}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </Link>;
            })}
        </nav>}
        </div>
      </header>
    </div>
  );
}
