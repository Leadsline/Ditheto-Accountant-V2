import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@assets/logo_1789318782052.png";

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img src={logo} alt="Ditheto Accountants" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pr-4">
              A 100% black-owned South African accounting, tax, payroll, bookkeeping, and business registration firm serving Pretoria and Secunda. Integrity you can count on.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-accent rounded-full"></span> Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-accent transition-colors block">Home</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-accent transition-colors block">Our Services</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-accent transition-colors block">About Us</Link></li>
              <li><Link href="/quote" className="text-gray-300 hover:text-accent transition-colors block">Request a Quote</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-accent transition-colors block">Contact Us</Link></li>
              <li><Link href="/admin" className="text-gray-500 hover:text-white transition-colors block mt-4 text-xs">Staff Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-accent rounded-full"></span> Pretoria Branch
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>No 238 Justice Mahomed Street,<br />Brooklyn, Pretoria, 0181</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>067 765 7387 <br/> 012 751 3200</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:admin@dithetoaccountants.co.za" className="hover:text-white">admin@dithetoaccountants.co.za</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-accent rounded-full"></span> Secunda Branch
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Shop No 25 Sanlam Plaza,<br />Horwood Street, Secunda, 2302</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>071 478 1810 <br/> 017 631 1890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:secunda@dithetoaccountants.co.za" className="hover:text-white">secunda@dithetoaccountants.co.za</a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Ditheto Accountants (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
