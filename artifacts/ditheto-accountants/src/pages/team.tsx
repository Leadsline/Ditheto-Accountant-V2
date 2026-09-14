import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { useListTeamMembers } from "@workspace/api-client-react";

type TeamMember = {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string | null;
  initials: string;
  image?: string | null;
  accent: "teal" | "gold" | "navy";
  level: "director" | "lead" | "team";
};

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
      className="group flex h-[250px] w-full flex-col items-center justify-start rounded-xl border border-secondary/15 bg-card px-5 py-6 text-center shadow-[0_18px_35px_-28px_hsl(var(--secondary))] transition-all hover:border-primary/45 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <ProfileAvatar member={member} />
      <span className="mt-4 flex w-full min-w-0 flex-1 flex-col items-center">
        <span className="block font-heading font-bold text-secondary group-hover:text-primary transition-colors">{member.name}</span>
        <span className="mx-auto mt-2 flex min-h-7 max-w-full items-center justify-center rounded-full border border-secondary/15 bg-background px-3 py-1 text-[9px] font-bold uppercase leading-4 tracking-[.1em] text-secondary/70">{member.title}</span>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold uppercase tracking-wider text-primary">
          View profile <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </motion.button>
  );
}

export default function Team() {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const { data, isLoading, isError } = useListTeamMembers();
  const team = useMemo<TeamMember[]>(() => (data ?? []).map((member) => ({
    id: member.id,
    name: member.name,
    title: member.title,
    bio: member.bio,
    email: member.email,
    phone: member.phone,
    initials: member.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "??",
    image: member.imageUrl,
    accent: member.accent,
    level: member.level,
  })), [data]);
  const directors = useMemo(() => team.filter((member) => member.level === "director"), [team]);
  const leads = useMemo(() => team.filter((member) => member.level === "lead"), [team]);
  const specialists = useMemo(() => team.filter((member) => member.level === "team"), [team]);

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

      <section className="bg-background py-20 sm:py-24">
        <div className="site-container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">Our team structure</p>
            <h2 className="serif-display text-4xl leading-none text-secondary sm:text-5xl">The right people in the right place.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Our Pretoria and Secunda teams bring together specialist knowledge and personal attention. Select any team member to learn more about the person supporting your business.
            </p>
          </Reveal>

          <Reveal className="mt-16" delay={.12}>
            {isLoading && <div className="rounded-3xl border border-secondary/10 bg-card p-12 text-center text-muted-foreground">Loading team structure…</div>}
            {isError && <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">The team structure could not be loaded. Please try again shortly.</div>}
            {!isLoading && !isError && (
            <div className="rounded-3xl border border-secondary/10 bg-card p-5 shadow-[0_24px_70px_-50px_hsl(var(--secondary))] sm:p-8 lg:p-12">
              <div className="space-y-8 lg:space-y-0">
                <div className="grid gap-4 lg:grid-cols-[150px_1fr] lg:items-center">
                  <div className="text-center lg:text-left">
                    <p className="eyebrow text-secondary/55">Supervisory level</p>
                    <p className="mt-1 text-xs text-muted-foreground">Direction & accountability</p>
                  </div>
                  <div className="mx-auto w-full max-w-xs">
                    {directors.map((member) => <MemberCard key={member.id} member={member} onSelect={setSelected} />)}
                  </div>
                </div>

                <div className="mx-auto hidden h-10 w-px bg-primary/30 lg:block" />

                <div className="grid gap-4 lg:grid-cols-[150px_1fr] lg:items-center">
                  <div className="text-center lg:text-left">
                    <p className="eyebrow text-secondary/55">Management level</p>
                    <p className="mt-1 text-xs text-muted-foreground">Specialist leads</p>
                  </div>
                  <div className="relative mx-auto grid w-full max-w-2xl gap-6 md:grid-cols-2">
                    <div className="absolute left-1/4 right-1/4 top-0 hidden h-px bg-primary/30 md:block" />
                    {leads.map((member) => (
                      <div key={member.id} className="relative pt-4">
                        <div className="absolute left-1/2 top-0 hidden h-4 w-px -translate-x-1/2 bg-primary/30 md:block" />
                        <MemberCard member={member} onSelect={setSelected} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mx-auto hidden h-10 w-px bg-primary/30 lg:block" />

                <div className="grid gap-4 lg:grid-cols-[150px_1fr] lg:items-center">
                  <div className="text-center lg:text-left">
                    <p className="eyebrow text-secondary/55">Team level</p>
                    <p className="mt-1 text-xs text-muted-foreground">Client-facing specialists</p>
                  </div>
                  <div className="relative mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-3">
                    <div className="absolute left-[16.66%] right-[16.66%] top-0 hidden h-px bg-primary/30 md:block" />
                    {specialists.map((member) => (
                      <div key={member.id} className="relative pt-4">
                        <div className="absolute left-1/2 top-0 hidden h-4 w-px -translate-x-1/2 bg-primary/30 md:block" />
                        <MemberCard member={member} onSelect={setSelected} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6" delay={.18}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-secondary"><strong>Integrity first.</strong> Every client relationship is built on discretion, accuracy, and honest advice.</p>
              </div>
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-secondary"><strong>Practical support.</strong> We explain the detail without making it feel complicated.</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 text-center">
            <Link href="/quote" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary">
              Work with our team <ArrowRight className="h-4 w-4" />
            </Link>
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