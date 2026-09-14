import { Building2, ExternalLink, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const branches = [
  {
    name: "Pretoria Branch (Brooklyn)",
    mapQuery: "238 Justice Mahomed Street Brooklyn Pretoria 0181",
    address: ["No 238 Justice Mahomed Street", "Brooklyn, Pretoria", "0181"],
    phones: ["067 765 7387", "012 751 3200"],
    email: "admin@dithetoaccountants.co.za",
    whatsapp: "https://wa.me/27677657387",
    accent: "primary",
  },
  {
    name: "Secunda Branch",
    mapQuery: "Sanlam Plaza Horwood Street Secunda 2302",
    address: ["Shop No 25 Sanlam Plaza", "Horwood Street, Secunda", "2302"],
    phones: ["071 478 1810", "017 631 1890"],
    email: "secunda@dithetoaccountants.co.za",
    whatsapp: "https://wa.me/27714781810",
    accent: "primary",
  },
] as const;

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background py-14 sm:py-20">
        <div className="site-container">
          <div className="border-t border-secondary/15 pt-8 sm:pt-10">
            <Reveal className="grid gap-8 md:grid-cols-3 md:gap-10">
              <a href="https://wa.me/27677657387" target="_blank" rel="noopener noreferrer" className="group">
                <MessageCircle className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <h2 className="mt-5 font-heading text-lg font-bold text-secondary">WhatsApp us</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Quickest for a short question or to send a document.</p>
                <span className="mt-4 inline-flex text-sm font-bold text-primary">Open WhatsApp <ExternalLink className="ml-1.5 h-4 w-4" /></span>
              </a>
              <a href="tel:+27677657387" className="group">
                <Phone className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <h2 className="mt-5 font-heading text-lg font-bold text-secondary">Call a branch</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Speak to someone during office hours, Monday to Friday.</p>
                <span className="mt-4 inline-flex text-sm font-bold text-primary">067 765 7387 <ExternalLink className="ml-1.5 h-4 w-4" /></span>
              </a>
              <a href="/quote" className="group">
                <Mail className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <h2 className="mt-5 font-heading text-lg font-bold text-secondary">Request a quote</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Pick your services and get an itemised quote by email.</p>
                <span className="mt-4 inline-flex text-sm font-bold text-primary">Start a request <ExternalLink className="ml-1.5 h-4 w-4" /></span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/45 py-16 sm:py-24">
        <div className="site-container">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Find us in person</p>
              <h1 className="serif-display text-4xl leading-none text-secondary sm:text-5xl">Our branches</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Walk-ins are welcome during office hours. If you're coming in with documents, a quick call ahead helps us have the right person ready.
              </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="mr-1 text-xs font-bold uppercase tracking-[.16em]">Follow us</span>
              {[
                { label: "Facebook", icon: Facebook },
                { label: "Instagram", icon: Instagram },
                { label: "Twitter", icon: Twitter },
              ].map(({ label, icon: Icon }) => (
                <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/15 transition-colors hover:border-primary hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {branches.map((branch, index) => (
              <Reveal key={branch.name} delay={index * .1}>
                <article className="overflow-hidden rounded-2xl border border-primary/15 border-l-4 border-l-primary bg-card shadow-[0_20px_55px_-38px_hsl(var(--secondary))]">
                  <iframe
                    title={`${branch.name} map`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`}
                    className="h-64 w-full border-0 grayscale-[.15] sm:h-72"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-primary">
                          <Building2 className="h-4 w-4" />
                          <p className="text-xs font-bold uppercase tracking-[.16em]">Ditheto Accountants</p>
                        </div>
                        <h2 className="serif-display mt-3 text-3xl text-secondary">{branch.name}</h2>
                      </div>
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    </div>
                    <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                      <p className="leading-6">{branch.address.map((line) => <span key={line} className="block">{line}</span>)}</p>
                      <div className="space-y-1">
                        {branch.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="block transition-colors hover:text-primary">{phone}</a>)}
                        <a href={`mailto:${branch.email}`} className="mt-2 block break-words transition-colors hover:text-primary">{branch.email}</a>
                      </div>
                    </div>
                    <div className="mt-7 flex flex-col gap-3 border-t border-secondary/10 pt-5 sm:flex-row">
                      <a href={branch.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a]">
                        <MessageCircle className="h-4 w-4" /> WhatsApp {branch.name.split(" ")[0]}
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary/20 px-4 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary">
                        Get directions <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
