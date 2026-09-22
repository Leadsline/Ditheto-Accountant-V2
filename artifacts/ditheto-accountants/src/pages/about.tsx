import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Target, Shield, Lightbulb, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="noise relative bg-secondary py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="display-title mb-6 text-4xl font-bold text-white md:text-6xl">About Ditheto Accountants</h1>
          <p className="text-xl text-gray-300">
            A 100% black-owned professional accounting firm bringing integrity, precision, and dedication to South African businesses.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <Reveal>
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Our Story</h2>
              <h3 className="text-3xl font-heading font-bold text-secondary mb-6">Empowering Business Growth Through Financial Clarity</h3>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Ditheto Accountants (Pty) Ltd was founded with a clear vision: to provide accessible, high-quality financial services to businesses and individuals who demand excellence. Based in Gauteng and Mpumalanga, our roots run deep in the communities we serve.
                </p>
                <p>
                  As a proudly 100% black-owned South African firm, we understand the unique challenges facing local entrepreneurs. We don't just process numbers; we partner with our clients to ensure they are structured correctly, compliant with SARS and other regulatory bodies, and positioned for sustainable growth.
                </p>
                <p className="font-semibold text-secondary pt-2 border-l-4 border-accent pl-4 italic">
                  "Our tagline 'Integrity You Can Count On' isn't just a marketing slogan — it's the foundational principle that guides every tax return we submit and every set of accounts we balance."
                </p>
               </div>
             </Reveal>
             <Reveal className="grid grid-cols-2 gap-4" delay={.1}>
              <Card className="bg-gray-50 border-none shadow-md">
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl text-secondary mb-2">100%</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Black-Owned</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 border-none shadow-md translate-y-8">
                <CardContent className="p-8 text-center">
                  <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl text-secondary mb-2">SARS</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Compliant</p>
                </CardContent>
              </Card>
              <Card className="bg-primary border-none shadow-md">
                <CardContent className="p-8 text-center">
                  <Target className="h-10 w-10 text-white mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl text-white mb-2">2</h4>
                  <p className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wide">Branches</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary border-none shadow-md translate-y-8">
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl text-white mb-2">Integrity</h4>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">Guaranteed</p>
                </CardContent>
              </Card>
             </Reveal>
          </div>
        </div>
      </section>

      {/* Mission, vision and values */}
      <section className="bg-muted/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto grid max-w-5xl gap-6 text-left md:grid-cols-2">
            <Reveal className="rounded-2xl border border-secondary/10 bg-card p-8 shadow-sm">
              <p className="eyebrow mb-3">Our Mission</p>
              <h2 className="text-2xl font-heading font-bold text-secondary">An active partner in your success.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">We aim to become an active partner to our clients with the purpose of establishing mutually beneficial and enduring relationships and achieving sustained commercial success through the provision of excellent transport, delivery and removal services.</p>
            </Reveal>
            <Reveal delay={.08} className="rounded-2xl border border-secondary/10 bg-card p-8 shadow-sm">
              <p className="eyebrow mb-3">Our Vision</p>
              <h2 className="text-2xl font-heading font-bold text-secondary">Built for the future.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">In the next five (5) years and beyond, to become a well-established, reputable and competitive SME participant in the formal stream economy. To continue to thrive as a business, we must look ahead, understand both internal and external environmental factors that will shape our business in the future and move swiftly to prepare for what’s to come. We conduct ourselves backward from the desired future!</p>
            </Reveal>
          </div>

          <h2 className="mt-20 mb-10 text-3xl font-heading font-bold text-secondary">Our Values</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Integrity", icon: Shield, color: "bg-primary/10 text-primary" },
              { name: "Performance", icon: Target, color: "bg-accent/20 text-accent" },
              { name: "Respect", icon: Users, color: "bg-blue-50 text-blue-600" },
              { name: "Innovation", icon: Lightbulb, color: "bg-primary/10 text-primary" },
              { name: "Teamwork", icon: CheckCircle2, color: "bg-accent/20 text-accent" },
              { name: "Speed", icon: Zap, color: "bg-blue-50 text-blue-600" },
            ].map(({ name, icon: Icon, color }, index) => (
              <Reveal key={name} delay={index * .05} className="rounded-2xl border border-secondary/10 bg-card p-6 text-left shadow-sm">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-secondary">{name}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
