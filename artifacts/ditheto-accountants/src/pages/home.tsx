import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import heroOne from "@assets/ditheto-accountants-hero-v2-corrected-v2_1789576958004.jpg";
import heroTwo from "@assets/ditheto-accountants-hero-v3-corrected_1789576958005.jpg";
import heroThree from "@assets/ditheto-accountants-hero-v4-corrected_1789576958002.jpg";

const heroImages = [heroOne, heroTwo, heroThree];

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const showSlide = (index: number) => {
    setActiveSlide((index + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    heroImages.forEach((source) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length);
    }, 7200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="group relative aspect-[79/53] w-full overflow-hidden rounded-[1.75rem] bg-secondary shadow-[0_35px_110px_-48px_rgba(46,188,179,.55),0_30px_80px_-46px_rgba(0,0,0,.9)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Ditheto Accountants welcome images"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
        {heroImages.map((source, index) => (
          <motion.img
            key={source}
            src={source}
            alt={index === activeSlide ? `Ditheto Accountants welcome image ${index + 1}` : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeSlide ? 1 : 0 }}
            transition={{ opacity: { duration: 0.9, ease: "easeInOut" } }}
            className="absolute inset-0 h-full w-full object-contain [will-change:opacity]"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-secondary/35 to-transparent" />
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => showSlide(index)}
            className={`h-1.5 rounded-full shadow-sm transition-all ${index === activeSlide ? "w-6 bg-accent" : "w-1.5 bg-white/60 hover:bg-white"}`}
            aria-label={`Show carousel image ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

const proofPoints = [
  "South African tax and compliance expertise",
  "Clear advice without accounting jargon",
  "One accountable team from filing to follow-up",
];

const professionalBodies = [
  { name: "SARS", src: `${import.meta.env.BASE_URL}partners/sars.png` },
  { name: "CIPC", src: `${import.meta.env.BASE_URL}partners/cipc.png` },
  { name: "SAIT", src: `${import.meta.env.BASE_URL}partners/sait.png` },
  { name: "SAIPA", src: `${import.meta.env.BASE_URL}partners/saipa.png` },
  { name: "SAICA", src: `${import.meta.env.BASE_URL}partners/saica.png` },
];

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <section className="noise relative bg-secondary text-white">
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full border border-primary/20 bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-1/2 bg-white/10" />
        <div className="site-container relative z-10">
          <div className="grid min-h-[700px] items-start gap-10 py-16 lg:items-stretch lg:grid-cols-[.78fr_1.22fr] lg:grid-rows-[auto_auto] lg:py-24">
            <p className="mb-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent lg:col-start-1 lg:row-start-1">
              <span className="h-px w-9 bg-accent" /> Built for the filing season
            </p>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, ease: [0.22, 1, .36, 1] }} className="max-w-3xl lg:col-start-1 lg:row-start-2">
              <h1 className="serif-display text-balance text-5xl leading-[.98] sm:text-6xl lg:text-[5.6rem]">
                Accounting and tax you <em className="text-accent">never</em> have to chase.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                We handle SARS submissions, payroll and company registrations for individuals and businesses across Pretoria and Secunda. Proudly black-owned, built on one promise — integrity you can count on.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/quote" className="button-shine inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-accent px-7 text-sm font-bold text-secondary transition-transform hover:-translate-y-1" data-testid="link-home-quote">
                  Request a quote <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href="https://wa.me/27677657387" target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-white/30 px-7 text-sm font-bold text-white transition-colors hover:border-primary hover:bg-primary/20" data-testid="link-home-whatsapp">
                  <MessageCircle className="h-4 w-4 text-accent" /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .15, ease: [0.22, 1, .36, 1] }} className="min-w-0 lg:col-start-2 lg:row-start-2 lg:self-center">
              <HeroCarousel />
            </motion.div>
          </div>
          <div className="grid border-t border-white/15 sm:grid-cols-4">
            {[
              ["Provisional tax", "IRP6 · twice a year"],
              ["Tax season", "ITR12 · opens 1 July"],
              ["VAT201", "Every second month"],
              ["EMP201", "Monthly · due the 7th"],
            ].map(([label, value], index) => (
              <div key={label} className={`border-white/15 py-5 ${index > 0 ? "border-l pl-5 sm:pl-6" : ""}`}>
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="mt-1 text-xs text-slate-400">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/55 py-20 sm:py-28">
        <div className="site-container grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <Reveal>
            <p className="eyebrow mb-5">The Ditheto difference</p>
            <h2 className="serif-display max-w-md text-4xl leading-[1.02] text-secondary sm:text-5xl">The right answer, before it becomes urgent.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">Good accounting is more than a submission. It is knowing where you stand, what is due next and who is already on it.</p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary" data-testid="link-home-about">
              Meet the firm <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-0 border-t editorial-rule">
            {proofPoints.map((point, index) => (
              <Reveal key={point} delay={index * .1}>
                <div className="flex gap-5 border-b editorial-rule py-7">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white"><Check className="h-4 w-4" /></span>
                  <div>
                    <p className="font-bold text-secondary">{point}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{["SARS rules change. Our work stays current, careful and documented.", "You should be able to understand your numbers without a dictionary.", "From first registration to monthly books, your context stays with us."][index]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="site-container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-5">Two branches. One accountable team.</p>
            <h2 className="serif-display text-balance text-4xl leading-[1.02] text-secondary sm:text-5xl">Local support in Pretoria and Secunda.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Choose the branch closest to you and speak to a team that understands the businesses and communities it serves.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { name: "Pretoria", address: "No 238 Justice Mahomed Street, Brooklyn, Pretoria, 0181", phone: "012 751 3200", mobile: "067 765 7387" },
              { name: "Secunda", address: "Shop No 25 Sanlam Plaza, Horwood Street, Secunda, 2302", phone: "017 631 1890", mobile: "071 478 1810" },
            ].map((branch, index) => (
              <Reveal key={branch.name} delay={index * .08} className="rounded-2xl border border-secondary/10 bg-card p-6 shadow-[0_18px_45px_-35px_hsl(var(--secondary)/.7)] sm:p-8">
                <p className="eyebrow mb-4">{branch.name} branch</p>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{branch.address}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-secondary">
                  <a href={`tel:${branch.phone.replaceAll(" ", "")}`} className="inline-flex items-center gap-2 transition-colors hover:text-primary"><Phone className="h-4 w-4 text-primary" />{branch.phone}</a>
                  <a href={`tel:${branch.mobile.replaceAll(" ", "")}`} className="inline-flex items-center gap-2 transition-colors hover:text-primary"><Phone className="h-4 w-4 text-primary" />{branch.mobile}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-accent/30 bg-secondary py-16 text-white sm:py-20">
        <div className="site-container">
          <p className="text-center text-[11px] font-bold uppercase tracking-[.24em] text-accent">Professional bodies &amp; partners</p>
          <div className="relative mt-8 overflow-hidden" aria-label="Professional bodies and organisations we work with">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-secondary to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-secondary to-transparent sm:w-28" />
            <div className="partner-marquee flex w-max items-center gap-5 px-5" role="list">
              {[...professionalBodies, ...professionalBodies].map((body, index) => (
                <span
                  key={`${body.name}-${index}`}
                  role="listitem"
                  aria-hidden={index >= professionalBodies.length}
                  className="inline-flex h-20 min-w-[13rem] items-center justify-center rounded-lg border border-white/20 bg-white px-6 py-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,.7)]"
                >
                  <img
                    src={body.src}
                    alt={index >= professionalBodies.length ? "" : body.name}
                    className="h-12 w-auto max-w-[12rem] object-contain"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}