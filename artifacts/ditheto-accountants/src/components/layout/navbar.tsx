import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@assets/logo_1789318782052.png";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="bg-secondary text-white text-xs py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center gap-2"><Phone className="h-3 w-3 text-accent" /> Pretoria: 067 765 7387 | Secunda: 071 478 1810</span>
            <span className="flex items-center gap-2"><Mail className="h-3 w-3 text-accent" /> admin@dithetoaccountants.co.za</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-accent tracking-wider uppercase text-[10px]">Integrity You Can Count On</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src={logo} alt="Ditheto Accountants" className="h-12 w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-foreground hover:text-primary font-medium text-sm transition-colors">Home</Link>
            <Link href="/services" className="text-foreground hover:text-primary font-medium text-sm transition-colors">Services</Link>
            <Link href="/about" className="text-foreground hover:text-primary font-medium text-sm transition-colors">About Us</Link>
            <Link href="/contact" className="text-foreground hover:text-primary font-medium text-sm transition-colors">Contact</Link>
            <Link href="/quote" className="bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded-md font-semibold text-sm transition-all shadow-sm">Request a Quote</Link>
          </nav>
          
          <div className="md:hidden flex items-center">
            {/* Mobile menu button could go here, but for now we'll keep it simple */}
            <Link href="/quote" className="bg-primary text-white px-4 py-2 rounded text-sm font-semibold">Quote</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
