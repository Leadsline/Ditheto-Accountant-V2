import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import "./_group.css";

const heroImages = [
  "/__mockup/images/ditheto-hero-one.jpg",
  "/__mockup/images/ditheto-hero-two.jpg",
  "/__mockup/images/ditheto-hero-three.jpg",
];

function HeroCarousel({ updated = false }: { updated?: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

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
      className={`group relative aspect-[79/53] w-full overflow-hidden bg-secondary ${updated ? "rounded-[1.25rem] shadow-[0_35px_110px_-48px_rgba(46,188,179,.4),0_30px_80px_-46px_rgba(0,0,0,.9)]" : "rounded-[1.75rem] shadow-[0_35px_110px_-48px_rgba(46,188,179,.55),0_30px_80px_-46px_rgba(0,0,0,.9)]"}`}
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
            onClick={() => setActiveSlide(index)}
            className={`h-1.5 rounded-full shadow-sm transition-all ${index === activeSlide ? "w-6 bg-accent" : "w-1.5 bg-white/60 hover:bg-white"}`}
            aria-label={`Show carousel image ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function Current({ updated = false }: { updated?: boolean }) {
  return (
    <main className="noise relative min-h-screen overflow-hidden bg-secondary text-white">
      <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full border border-primary/20 bg-primary/10 blur-3xl" />
      <div className="site-container relative z-10">
        <div className={updated ? "grid items-start gap-9 py-12 sm:gap-12 sm:py-16 lg:min-h-[590px] lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-10 lg:py-16" : "grid min-h-[700px] items-start gap-10 py-16 lg:items-stretch lg:grid-cols-[.78fr_1.22fr] lg:grid-rows-[auto_auto] lg:py-24"}>
          {!updated && (
            <p className="mb-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent lg:col-start-1 lg:row-start-1">
              <span className="h-px w-9 bg-accent" /> Built for the filing season
            </p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className={updated ? "max-w-3xl lg:self-center" : "max-w-3xl lg:col-start-1 lg:row-start-2"}
          >
            <h1 className={updated ? "serif-display text-balance text-5xl leading-[.98] sm:text-6xl lg:text-[4.8rem] xl:text-[5.2rem]" : "serif-display text-balance text-5xl leading-[.98] sm:text-6xl lg:text-[5.6rem]"}>
              Accounting and tax you <em className="text-accent">never</em> have to chase.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              We handle SARS submissions, payroll and company registrations for individuals and businesses across Pretoria and Secunda. Proudly black-owned, built on one promise — integrity you can count on.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-accent px-7 text-sm font-bold text-secondary transition-transform hover:-translate-y-1">
                Request a quote <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="https://wa.me/27677657387" className="inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-white/30 px-7 text-sm font-bold text-white transition-colors hover:border-primary hover:bg-primary/20">
                <MessageCircle className="h-4 w-4 text-accent" /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={updated ? "min-w-0 lg:self-center" : "min-w-0 lg:col-start-2 lg:row-start-2 lg:self-center"}
          >
            <HeroCarousel updated={updated} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
