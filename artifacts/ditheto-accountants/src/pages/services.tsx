import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, FileSpreadsheet, Briefcase, FileText, CheckCircle, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const services = [
  {
    id: "tax",
    title: "Tax Services",
    icon: Calculator,
    description: "Comprehensive tax solutions to keep you compliant and stress-free.",
    items: [
      { name: "ITR12 Tax Return Submission", desc: "Expert filing of individual income tax returns ensuring all allowable deductions are claimed.", benefits: ["Avoid penalties", "Maximize refunds", "Stress-free process"] },
      { name: "IRP6 Provisional Tax / Certificate", desc: "Biannual provisional tax calculations and submissions for businesses and independent contractors.", benefits: ["Accurate estimates", "Timely submissions", "Cash flow planning"] },
      { name: "Tax Refund Assistance", desc: "We track and expedite pending tax refunds owed to you by SARS.", benefits: ["Faster payouts", "Zero admin on your side"] },
      { name: "SARS eFiling Assistance", desc: "Setup, management, and troubleshooting of your SARS eFiling profile.", benefits: ["Secure profile", "Easy access to records"] },
      { name: "Tax Compliance Checks", desc: "Comprehensive reviews of your tax status to identify and resolve issues before they become penalties.", benefits: ["Peace of mind", "Audit readiness"] },
      { name: "Correction of Previous Tax Returns", desc: "Fixing errors in past submissions to ensure total accuracy and compliance.", benefits: ["Avoid historical penalties", "Clear your record"] },
      { name: "Auto Assessment Review", desc: "Reviewing SARS auto-assessments before acceptance to ensure they haven't missed your deductions.", benefits: ["Pay less tax", "Verify SARS calculations"] },
      { name: "SARS Queries & Verification Assistance", desc: "Professional representation and documentation submission when SARS flags you for verification.", benefits: ["Expert handling", "Faster resolution"] },
      { name: "VAT 201 Submissions", desc: "Accurate monthly or bi-monthly value-added tax calculations and submissions.", benefits: ["Input tax optimization", "Penalty avoidance"] },
      { name: "EMP201 / EMP501", desc: "Monthly employer declarations and bi-annual reconciliations for PAYE, SDL, and UIF.", benefits: ["Employee compliance", "Accurate IRP5s"] },
      { name: "IT14 / ITR14 Business Income Tax", desc: "Corporate income tax return preparation and submission for registered companies.", benefits: ["Maximize corporate deductions", "Total compliance"] },
      { name: "Tax Clearance Certificates", desc: "Application and expediting of Good Standing certificates required for tenders and contracts.", benefits: ["Tender readiness", "Business credibility"] },
      { name: "Tax Registrations", desc: "Initial setup for Individual Tax, VAT, PAYE, UIF, SDL, and COIDA.", benefits: ["Right from day one", "Complete setup"] },
    ]
  },
  {
    id: "payroll",
    title: "Payroll Services",
    icon: FileSpreadsheet,
    description: "Accurate and timely payroll processing and management.",
    items: [
      { name: "Payslips", desc: "Professional, compliant digital or printed payslips for all staff members.", benefits: ["Professional image", "Labor law compliant"] },
      { name: "EMP201", desc: "Monthly calculation and submission of PAYE, UIF, and SDL to SARS.", benefits: ["Zero late penalties", "Accurate deductions"] },
      { name: "UIF Declarations", desc: "Monthly UI19 declarations submitted directly to the Department of Labour.", benefits: ["Protect your employees", "Legal compliance"] },
      { name: "Salary Calculations", desc: "Accurate calculation of net pay, overtime, bonuses, and statutory deductions.", benefits: ["Zero errors", "Happy employees"] },
      { name: "Full Payroll Processing", desc: "End-to-end management of your entire payroll cycle.", benefits: ["Save time", "Focus on core business"] },
      { name: "Employee Benefits Administration", desc: "Management of medical aid, provident fund, and pension deductions.", benefits: ["Accurate administration", "Employee satisfaction"] },
    ]
  },
  {
    id: "registration",
    title: "Registration & Consulting",
    icon: Briefcase,
    description: "Establish and structure your business for success.",
    items: [
      { name: "Company Registration (Pty) Ltd", desc: "Full CIPC registration including name reservation, MOI, and initial directorship.", benefits: ["Fast turnaround", "Ready to trade"] },
      { name: "Co-operative Registration", desc: "Specialized registration for co-operative entities with CIPC.", benefits: ["Correct structuring", "Compliance"] },
      { name: "NPO Registration", desc: "Registration with the Department of Social Development for Non-Profit status.", benefits: ["Funding readiness", "Legal status"] },
      { name: "CIDB Registration", desc: "Construction Industry Development Board registration and grading assistance.", benefits: ["Tender compliance", "Construction sector readiness"] },
      { name: "Company Profiles", desc: "Professional, well-designed corporate profiles outlining your business services and vision.", benefits: ["Professional marketing", "Client trust"] },
      { name: "Business Consulting", desc: "Strategic advice on structuring, growth, and financial management.", benefits: ["Expert guidance", "Better decisions"] },
    ]
  },
  {
    id: "accounting",
    title: "Accounting & Bookkeeping",
    icon: FileText,
    description: "Keep your finger on the pulse of your business finances.",
    items: [
      { name: "Monthly Bookkeeping", desc: "Accurate recording of all financial transactions using modern accounting software.", benefits: ["Real-time data", "Audit readiness"] },
      { name: "Management Accounts", desc: "Monthly or quarterly financial reports detailing profit/loss, balance sheet, and cash flow.", benefits: ["Strategic insights", "Performance tracking"] },
      { name: "Bank Reconciliations", desc: "Matching your business bank statements with accounting records to ensure accuracy.", benefits: ["Fraud prevention", "Financial accuracy"] },
      { name: "Mentoring for Business Owners", desc: "One-on-one sessions helping you understand your numbers and manage growth.", benefits: ["Financial literacy", "Empowered leadership"] },
    ]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <section className="noise relative overflow-hidden bg-secondary py-20 text-white sm:py-28">
        <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="site-container relative z-10">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent"><span className="h-px w-9 bg-accent" /> What we do</p>
            <h1 className="serif-display max-w-3xl text-5xl leading-[.98] sm:text-7xl">Everything a South African business needs to stay compliant.</h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Four practice areas, one accountable team. Open any of them to see exactly what is included before you ask for a quote.</p>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-4">
            {services.map((category, index) => (
              <a href={`#${category.id}`} key={category.id} className="border-t border-white/20 pt-4 text-sm text-white/75 transition-colors hover:text-accent" data-testid={`link-service-index-${category.id}`}>
                <span className="serif-display mr-2 text-xl text-accent/80">0{index + 1}</span>{category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="site-container mt-16 sm:mt-24">
        <div className="space-y-20">
          {services.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Reveal key={category.id} delay={categoryIndex * .06} className="scroll-mt-24" >
                <section id={category.id}>
                  <div className="mb-7 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <p className="eyebrow mb-3">0{categoryIndex + 1} — {category.items.length} services</p>
                      <div className="flex items-start gap-4">
                        <Icon className="mt-2 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <h2 className="serif-display text-4xl leading-none text-secondary sm:text-5xl">{category.title}</h2>
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </div>
                    <Link href={`/quote?service=${encodeURIComponent(category.title)}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-primary px-5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white" data-testid={`link-quote-category-${category.id}`}>
                      Quote for {category.title.split(" ")[0]} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-primary/25 border-t-4 border-t-primary bg-card shadow-[0_18px_45px_-35px_hsl(var(--secondary)/.7)]">
                    <Accordion type="multiple" defaultValue={[`${category.id}-0`]} className="w-full">
                      {category.items.map((item, idx) => (
                        <AccordionItem value={`${category.id}-${idx}`} key={item.name} className="border-b border-foreground/10 px-5 last:border-0 sm:px-7">
                          <AccordionTrigger className="gap-4 py-6 text-left font-heading text-base font-bold text-secondary hover:no-underline hover:text-primary sm:text-lg" data-testid={`button-expand-${category.id}-${idx}`}>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-3">
                                <span>{item.name}</span>
                                {idx === 0 && <span className="rounded-full bg-accent/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">Most requested</span>}
                              </span>
                              <span className="mt-2 block max-w-3xl text-xs font-normal leading-5 text-muted-foreground sm:text-sm">{item.desc}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-7 text-muted-foreground">
                            <div className="grid gap-8 md:grid-cols-2">
                              <div>
                                <p className="mb-4 text-sm font-bold text-secondary">What’s included</p>
                                <ul className="grid gap-3">
                                  {item.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2 text-sm leading-6"><CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />{benefit}</li>)}
                                </ul>
                              </div>
                              <div className="border-t border-primary/15 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                                <p className="mb-4 text-sm font-bold text-secondary">Why it matters</p>
                                <ul className="grid gap-3">
                                  {item.benefits.map((benefit) => <li key={`${item.name}-${benefit}`} className="flex items-start gap-2 text-sm leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{benefit}</li>)}
                                </ul>
                                <Link href={`/quote?service=${encodeURIComponent(item.name)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary" data-testid={`link-quote-item-${category.id}-${idx}`}>
                                  Request a quote <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                            <div className="mt-7 flex flex-col gap-4 rounded-xl bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                              <p className="text-sm leading-6"><strong className="text-secondary">Who it is for:</strong> Salaried employees, business owners, contractors, and growing teams who want the detail handled properly.</p>
                              <Link href={`/quote?service=${encodeURIComponent(item.name)}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-secondary" data-testid={`link-quote-footer-${category.id}-${idx}`}>
                                Request a quote <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-20 bg-secondary px-6 py-12 text-center text-white sm:px-10">
          <p className="eyebrow text-accent">Not sure where to begin?</p>
          <h2 className="serif-display mt-4 text-4xl">Tell us what is on your desk.</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">Select multiple services in our quotation form and we will shape the right package around your business.</p>
          <Link href="/quote" className="mt-7 inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-bold text-secondary transition-transform hover:-translate-y-1" data-testid="link-services-package">
            Build your package <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
