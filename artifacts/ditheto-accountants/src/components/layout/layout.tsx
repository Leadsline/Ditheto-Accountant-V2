import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MessageCircle } from "lucide-react";
import { PageEnter } from "@/components/motion/reveal";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar />
        <main className="flex-1 w-full bg-background">
         <PageEnter>{children}</PageEnter>
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/27677657387?text=Hi%20Ditheto%20Accountants,%20I%20need%20assistance%20with..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[#168a63] text-white p-4 rounded-full shadow-[0_14px_30px_-10px_rgba(20,94,74,.65)] hover:bg-[#11704f] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group ring-4 ring-white/80"
        aria-label="Chat on WhatsApp"
        data-testid="link-floating-whatsapp"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute right-full mr-4 bg-secondary text-white text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
          Chat with us
        </span>
      </a>
    </div>
  );
}
