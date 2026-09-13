import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, FileSpreadsheet, Briefcase, FileText, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-secondary py-16 text-center border-b-4 border-accent">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Services</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg px-4">
          Comprehensive accounting, tax, and compliance solutions tailored to your unique needs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="space-y-12">
          {services.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-secondary">{category.title}</h2>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>

              <Card className="shadow-md border-gray-200">
                <CardContent className="p-0">
                  <Accordion type="multiple" className="w-full">
                    {category.items.map((item, idx) => (
                      <AccordionItem value={`item-${idx}`} key={idx} className="border-b last:border-0 px-6">
                        <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-left font-semibold text-secondary py-5">
                          {item.name}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-6">
                          <p className="mb-4 text-base">{item.desc}</p>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-bold text-secondary mb-2 uppercase tracking-wide">Key Benefits</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {item.benefits.map((benefit, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Link href={`/quote?service=${encodeURIComponent(item.name)}`}>
                              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                                Request a Quote for this service
                              </Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full"></div>
          <h3 className="text-2xl font-heading font-bold text-secondary mb-4 relative z-10">Need a custom combination?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto relative z-10">
            Every business is different. Select multiple services in our quotation form to get a comprehensive, tailored package.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-md relative z-10">
              Build Your Package
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
