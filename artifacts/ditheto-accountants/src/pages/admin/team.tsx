import { useMemo, useRef, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, ShieldCheck, Trash2, Upload, X } from "lucide-react";

type Person = {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  parent: string;
  initials: string;
  image?: string;
};

const startingTeam: Person[] = [
  { id: 1, name: "Nomsa Mokoena", title: "Managing Director", bio: "Leads the firm and oversees client relationships, quality, and growth.", email: "nomsa@dithetoaccountants.co.za", phone: "067 765 7387", parent: "Leadership", initials: "NM" },
  { id: 2, name: "Thabo Maseko", title: "Tax & Compliance Manager", bio: "Leads tax submissions, SARS compliance, and advisory work.", email: "thabo@dithetoaccountants.co.za", phone: "012 751 3200", parent: "Nomsa Mokoena", initials: "TM" },
  { id: 3, name: "Lerato Dlamini", title: "Payroll Supervisor", bio: "Oversees payroll processing and monthly employer submissions.", email: "lerato@dithetoaccountants.co.za", phone: "", parent: "Nomsa Mokoena", initials: "LD" },
  { id: 4, name: "Siyabonga Ncube", title: "Senior Accountant", bio: "Supports monthly accounts and management reporting.", email: "siyabonga@dithetoaccountants.co.za", phone: "", parent: "Thabo Maseko", initials: "SN" },
  { id: 5, name: "Zanele Khumalo", title: "Bookkeeping Specialist", bio: "Keeps client records accurate, current, and decision-ready.", email: "zanele@dithetoaccountants.co.za", phone: "", parent: "Thabo Maseko", initials: "ZK" },
];

const emptyPerson: Omit<Person, "id"> = {
  name: "", title: "", bio: "", email: "", phone: "", parent: "Leadership", initials: "??",
};

function initialsFor(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "??";
}

export default function AdminTeam() {
  const [people, setPeople] = useState(startingTeam);
  const [editing, setEditing] = useState<Person | null>(null);
  const [draft, setDraft] = useState<Omit<Person, "id">>(emptyPerson);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const parentOptions = useMemo(() => ["Leadership", ...people.filter((person) => person.id !== editing?.id).map((person) => person.name)], [people, editing?.id]);

  const startAdd = () => {
    setEditing({ id: 0, ...emptyPerson });
    setDraft(emptyPerson);
    setNotice("");
  };

  const startEdit = (person: Person) => {
    setEditing(person);
    setDraft({ ...person });
    setNotice("");
  };

  const cancel = () => {
    setEditing(null);
    setNotice("");
  };

  const save = () => {
    if (!draft.name.trim() || !draft.title.trim() || !draft.email.trim()) {
      setNotice("Name, job title, and email are required.");
      return;
    }
    const next = { ...draft, initials: initialsFor(draft.name) };
    setPeople((current) => editing?.id ? current.map((person) => person.id === editing.id ? { ...next, id: editing.id } : person) : [...current, { ...next, id: Date.now() }]);
    setNotice("Team member saved in this preview.");
    setEditing(null);
  };

  const remove = (person: Person) => {
    if (!window.confirm(`Remove ${person.name} from the team?`)) return;
    setPeople((current) => current.filter((item) => item.id !== person.id).map((item) => item.parent === person.name ? { ...item, parent: "Leadership" } : item));
    setNotice(`${person.name} removed from the preview.`);
  };

  const uploadImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">People & hierarchy</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-secondary">Manage Team</h1>
          <p className="mt-2 max-w-2xl text-gray-500">Add staff profiles, update contact details, replace profile photos, and place each person in the organogram.</p>
        </div>
        <Button onClick={startAdd} className="gap-2 bg-primary text-white hover:bg-primary/90"><Plus className="h-4 w-4" /> Add team member</Button>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-secondary">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p><strong>Admin-only controls.</strong> In production, this screen is intended for authenticated staff and stores changes in the team database. This preview demonstrates the complete editing experience.</p>
      </div>

      {notice && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader className="border-b"><CardTitle className="font-heading text-lg">Current organogram</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {people.map((person) => (
                <div key={person.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    {person.image ? <img src={person.image} alt="" className="h-12 w-12 rounded-full object-cover ring-4 ring-primary/10" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary ring-4 ring-primary/5">{person.initials}</div>}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-secondary">{person.name}</p>
                      <p className="text-sm text-primary">{person.title}</p>
                      <p className="mt-1 text-xs text-gray-400">Reports to: {person.parent}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Button variant="outline" size="sm" onClick={() => startEdit(person)} className="gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => remove(person)} className="gap-2 text-red-600 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {editing ? (
          <Card className="h-fit xl:sticky xl:top-28">
            <CardHeader className="flex flex-row items-start justify-between border-b">
              <div><CardTitle className="font-heading text-lg">{editing.id ? "Edit team member" : "Add team member"}</CardTitle><p className="mt-1 text-sm text-gray-500">Update the public profile details.</p></div>
              <Button variant="ghost" size="icon" onClick={cancel} aria-label="Close editor"><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                {draft.image ? <img src={draft.image} alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-primary/10" /> : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary ring-4 ring-primary/5">{initialsFor(draft.name)}</div>}
                <div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => uploadImage(event.target.files?.[0])} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2"><Upload className="h-3.5 w-3.5" /> Upload photo</Button>
                  <p className="mt-1 text-xs text-gray-400">JPG or PNG, square works best.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="space-y-2"><Label htmlFor="team-name">Full name</Label><Input id="team-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Naledi Molefe" /></div>
                <div className="space-y-2"><Label htmlFor="team-title">Job title</Label><Input id="team-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Tax Consultant" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="team-bio">Short bio</Label><Textarea id="team-bio" rows={4} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} placeholder="A short introduction for the public team page." /></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="space-y-2"><Label htmlFor="team-email">Email</Label><Input id="team-email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="name@dithetoaccountants.co.za" /></div>
                <div className="space-y-2"><Label htmlFor="team-phone">Phone (optional)</Label><Input id="team-phone" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="067 765 7387" /></div>
              </div>
              <div className="space-y-2"><Label>Reports to</Label><Select value={draft.parent} onValueChange={(value) => setDraft({ ...draft, parent: value })}><SelectTrigger><SelectValue placeholder="Choose a parent" /></SelectTrigger><SelectContent>{parentOptions.map((parent) => <SelectItem key={parent} value={parent}>{parent}</SelectItem>)}</SelectContent></Select></div>
              <div className="flex gap-3 pt-2"><Button onClick={save} className="flex-1 bg-primary text-white hover:bg-primary/90">Save profile</Button><Button variant="outline" onClick={cancel}>Cancel</Button></div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-fit bg-secondary text-white">
            <CardContent className="p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">Organogram controls</p>
              <h2 className="mt-3 font-heading text-2xl font-bold">Keep the public team page current.</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">Use the editor to maintain titles, biographies, contact details, profile images, and reporting relationships. Changes can later be connected to the staff database.</p>
              <Button onClick={startAdd} className="mt-6 gap-2 bg-accent text-secondary hover:bg-accent/90"><Plus className="h-4 w-4" /> Add a profile</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}