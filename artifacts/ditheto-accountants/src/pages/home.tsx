import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, FileText, Briefcase, FileSpreadsheet, CheckCircle2, ChevronRight, TrendingUp, ShieldCheck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

import heroImg from "@assets/1_1789318706811.jpeg";
import trustImg from "@assets/3_1789318706812.jpeg";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="noise relative w-full overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.02fr_.98fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-accent text-sm font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                TAX SEASON IS HERE
              </div>
              <h1 className="display-title text-4xl font-extrabold leading-[1.06] text-white md:text-6xl lg:text-[4.25rem]">
                Accounting & Tax Services You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">Trust</span>.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
                Expert tax submissions, payroll, and business registrations for individuals and enterprises in Pretoria and Secunda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg w-full sm:w-auto shadow-lg hover:shadow-primary/25 transition-all">
                    Get a Quote Today
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 h-14 px-8 text-lg w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 flex items-center gap-6 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-accent" /> Fast Turnaround</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-accent" /> 100% Compliant</div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .12 }} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent opacity-20 blur-2xl rounded-full"></div>
              <div className="relative rotate-[-1.5deg] overflow-hidden rounded-[1.5rem] border border-white/10 shadow-2xl transition-transform duration-500 hover:rotate-0">
                <img 
                  src={heroImg} 
                  alt="Ditheto Accountants Tax Services" 
                  className="w-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#10B981] text-white p-2 rounded-full">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">SARS Compliance Guaranteed</p>
                      <p className="text-gray-300 text-sm">Don't miss the deadline.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-secondary/10 bg-background py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center font-heading text-sm font-bold uppercase tracking-[0.18em] text-secondary/65 md:justify-between md:text-base">
            <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> FAST</span>
            <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> ACCURATE</span>
            <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> RELIABLE</span>
            <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-accent"></span> YOUR TRUST. OUR PRIORITY.</span>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-muted/60 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Reveal className="mx-auto mb-16 max-w-3xl text-center">
             <h2 className="eyebrow mb-3">What We Do</h2>
             <h3 className="display-title mb-6 text-3xl font-bold text-secondary md:text-4xl">Comprehensive Financial Solutions</h3>
            <p className="text-gray-600 text-lg">From personal tax returns to corporate payroll, we remove the stress of compliance so you can focus on growth.</p>
           </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Tax Services", desc: "ITR12, IRP6, VAT201, auto-assessments and SARS dispute resolutions.", icon: Calculator, color: "bg-blue-50 text-blue-600" },
              { title: "Payroll Services", desc: "Payslips, EMP201 submissions, UIF declarations and full processing.", icon: FileSpreadsheet, color: "bg-teal-50 text-primary" },
              { title: "Business Registration", desc: "Company (Pty) Ltd, NPO, CIDB registrations and business profiles.", icon: Briefcase, color: "bg-amber-50 text-accent" },
              { title: "Accounting", desc: "Monthly bookkeeping, management accounts and bank reconciliations.", icon: FileText, color: "bg-indigo-50 text-indigo-600" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * .07}>
              <Card className="lift-card group h-full border border-secondary/8 bg-card shadow-md">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${s.color} transition-transform group-hover:scale-110`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-secondary mb-3">{s.title}</h4>
                  <p className="text-gray-600 mb-6 line-clamp-3">{s.desc}</p>
                  <Link href="/services" className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors text-sm">
                    Read more <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/services">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-6 text-base rounded-full">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="overflow-hidden bg-card py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="relative">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                 <img src={trustImg} alt="Ditheto IRP6 Service" className="w-full object-cover" />
               </div>
              
               <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-secondary font-bold text-xl">D</div>
                  <div>
                    <h4 className="font-heading font-bold text-secondary">Submit On Time!</h4>
                    <p className="text-sm text-gray-500">100% Tax Compliant</p>
                  </div>
                </div>
              </div>
            </div>

             <div className="space-y-8">
              <div>
                <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Why Choose Ditheto</h2>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Integrity You Can Count On</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We are a 100% black-owned professional accounting firm dedicated to delivering precise, reliable, and tailored financial solutions for businesses and individuals across Gauteng and Mpumalanga.
                </p>
               </div>

              <div className="space-y-6">
                {[
                  { title: "Expert Knowledge", desc: "Deep understanding of SARS regulations and current tax laws." },
                  { title: "Personalized Service", desc: "Tailored financial solutions that fit your specific business needs." },
                  { title: "Transparent Pricing", desc: "No hidden fees. Request a quote and know exactly what you'll pay." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-secondary mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold h-12 px-8">
                    Learn About Our Firm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="noise relative overflow-hidden bg-primary py-20">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Ready to take the hassle out of tax and accounting?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Contact Ditheto Accountants today for a comprehensive, customized quote tailored to your exact needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/quote">
              <Button size="lg" className="bg-accent text-secondary hover:bg-yellow-400 font-bold h-14 px-8 text-lg w-full sm:w-auto">
                Request a Free Quote
              </Button>
            </Link>
            <a href="https://wa.me/27677657387" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-secondary hover:bg-white bg-white font-bold h-14 px-8 text-lg w-full sm:w-auto gap-2">
                <MessageCircle className="h-5 w-5 text-[#25D366]" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
