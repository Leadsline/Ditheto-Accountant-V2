import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  initials: string;
  image?: string;
  accent: "teal" | "gold" | "navy";
  level: "director" | "lead" | "team";
};

const team: TeamMember[] = [
  {
    id: "nomsa",
    name: "Nomsa Mokoena",
    title: "Managing Director",
    bio: "Nomsa leads Ditheto with a practical belief that every business owner deserves clear numbers, calm guidance, and a partner who follows through.",
    email: "nomsa@dithetoaccountants.co.za",
    phone: "067 765 7387",
    initials: "NM",
    accent: "gold",
    level: "director",
  },
  {
    id: "thabo",
    name: "Thabo Maseko",
    title: "Tax & Compliance Manager",
    bio: "Thabo helps clients stay ahead of SARS deadlines and turns complex compliance questions into clear next steps.",
    email: "thabo@dithetoaccountants.co.za",
    phone: "012 751 3200",
    initials: "TM",
    accent: "teal",
    level: "lead",
  },
  {
    id: "lerato",
    name: "Lerato Dlamini",
    title: "Payroll Supervisor",
    bio: "Lerato oversees accurate payroll processing, EMP submissions, UIF declarations, and dependable employee support.",
    email: "lerato@dithetoaccountants.co.za",
    initials: "LD",
    accent: "teal",
    level: "lead",
  },
  {
    id: "siyabonga",
    name: "Siyabonga Ncube",
    title: "Senior Accountant",
    bio: "Siyabonga works alongside growing businesses on monthly accounting, management accounts, and decision-ready reporting.",
    email: "siyabonga@dithetoaccountants.co.za",
    initials: "SN",
    accent: "navy",
    level: "team",
  },
  {
    id: "zanele",
    name: "Zanele Khumalo",
    title: "Bookkeeping Specialist",
    bio: "Zanele keeps the day-to-day detail in order so clients can focus on serving customers and building their businesses.",
    email: "zanele@dithetoaccountants.co.za",
    initials: "ZK",
    accent: "gold",
    level: "team",
  },
  {
    id: "mpho",
    name: "Mpho Radebe",
    title: "Client Services Coordinator",
    bio: "Mpho makes sure every client receives a responsive, thoughtful experience from the first enquiry to ongoing support.",
    email: "mpho@dithetoaccountants.co.za",
    initials: "MR",
    accent: "teal",
    level: "team",
  },
];

const accentClasses = {
  teal: "border-primary bg-primary/10 text-primary",
  gold: "border-accent bg-accent/10 text-amber-700",
  navy: "border-secondary bg-secondary/10 text-secondary",
};

function ProfileAvatar({ member, large = false }: { member: TeamMember; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (member.image && !imageFailed) {
    return (
      <img
        src={member.image}
        alt={`${member.name} profile`}
        onError={() => setImageFailed(true)}
        className={`${large ? "h-24 w-24" : "h-20 w-20"} rounded-full border-4 border-white object-cover shadow-md ring-2 ring-primary/20 shrink-0`}
      />
    );
  }
  return (
    <div className={`${large ? "h-24 w-24 text-2xl" : "h-20 w-20 text-xl"} rounded-full border-4 ${accentClasses[member.accent]} flex items-center justify-center font-heading font-bold shadow-sm shrink-0`}>
      {member.initials}
    </div>
  );
}

function MemberCard({ member, onSelect }: { member: TeamMember; onSelect: (member: TeamMember) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(member)}
      whileHover={{ y: -5 }}
      transition={{ duration: .25 }}
      className="group flex w-full items-center gap-5 rounded-2xl border border-secondary/10 bg-card p-6 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <ProfileAvatar member={member} />
      <span className="min-w-0">
        <span className="block font-heading font-bold text-secondary group-hover:text-primary transition-colors">{member.name}</span>
        <span className="mt-1 block text-sm text-gray-500">{member.title}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
          View profile <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </motion.button>
  );
}

export default function Team() {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const directors = useMemo(() => team.filter((member) => member.level === "director"), []);
  const leads = useMemo(() => team.filter((member) => member.level === "lead"), []);
  const specialists = useMemo(() => team.filter((member) => member.level === "team"), []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-secondary py-20 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              <UsersRound className="h-4 w-4" /> The people behind the numbers
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">Meet the Ditheto team.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              A connected team of accountants, tax specialists, and client partners committed to making every financial decision clearer.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Our team structure</p>
              <h2 className="font-heading text-3xl font-bold text-secondary md:text-4xl">The right people in the right place.</h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Our Pretoria and Secunda teams bring together specialist knowledge and personal attention. Select any team member to learn more about the person supporting your business.
              </p>
              <div className="mt-8 space-y-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-secondary"><strong>Integrity first.</strong> Every client relationship is built on discretion, accuracy, and honest advice.</p>
                </div>
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-secondary"><strong>Practical support.</strong> We explain the detail without making it feel complicated.</p>
                </div>
              </div>
              <Link href="/quote" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary">
                Work with our team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

              <Reveal className="relative" delay={.12}>
              <div className="hidden absolute left-1/2 top-24 h-16 w-px -translate-x-1/2 bg-primary/25 lg:block" />
            <div className="mx-auto w-full max-w-xl">
                {directors.map((member) => <MemberCard key={member.id} member={member} onSelect={setSelected} />)}
              </div>
              <div className="mx-auto hidden h-10 w-[66%] border-l border-r border-t border-primary/25 lg:block" />
              <div className="grid gap-6 md:grid-cols-2">
                {leads.map((member) => (
                  <div key={member.id} className="relative">
                    <div className="hidden absolute -top-5 left-1/2 h-5 w-px bg-primary/25 md:block" />
                    <MemberCard member={member} onSelect={setSelected} />
                  </div>
                ))}
              </div>
              <div className="mx-auto hidden h-10 w-[82%] border-l border-r border-t border-primary/25 lg:block" />
              <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {specialists.map((member) => (
                  <div key={member.id} className="relative">
                    <div className="hidden absolute -top-5 left-1/2 h-5 w-px bg-primary/25 md:block" />
                    <MemberCard member={member} onSelect={setSelected} />
                  </div>
                ))}
              </div>
              </Reveal>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <ProfileAvatar member={selected} large />
                  <div>
                    <DialogTitle className="font-heading text-2xl text-secondary">{selected.name}</DialogTitle>
                    <DialogDescription className="mt-1 font-semibold text-primary">{selected.title}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <p className="mt-4 leading-relaxed text-gray-600">{selected.bio}</p>
              <div className="mt-4 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-secondary hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" /> {selected.email}
                </a>
                {selected.phone && (
                  <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-secondary hover:text-primary">
                    <Phone className="h-4 w-4 text-primary" /> {selected.phone}
                  </a>
                )}
              </div>
              <Button asChild className="mt-2 bg-primary text-white hover:bg-primary/90">
                <Link href="/quote">Start a conversation</Link>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}