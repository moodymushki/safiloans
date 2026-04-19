import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Briefcase, Banknote, ChevronRight, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className={`py-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </section>
  );
};

const tiers = [
  {
    title: "Starter Loan",
    range: "Ksh 5,500 – 25,000",
    interest: "3%",
    icon: Wallet,
    color: "bg-primary/10 text-primary",
    eligibility: ["Kenyan citizen 18+", "Valid national ID", "Active M-Pesa account"],
    repayment: "1 – 3 months",
    docs: ["National ID copy", "M-Pesa statement"],
  },
  {
    title: "Growth Loan",
    range: "Ksh 25,500 – 65,070",
    interest: "3%",
    icon: Briefcase,
    color: "bg-secondary/10 text-secondary",
    eligibility: ["Kenyan citizen 18+", "Proof of income", "Active bank account or M-Pesa"],
    repayment: "1 – 6 months",
    docs: ["National ID copy", "Pay slip or bank statement", "M-Pesa statement"],
  },
  {
    title: "Premium Loan",
    range: "Ksh 75,500 – 124,500",
    interest: "3%",
    icon: Banknote,
    color: "bg-safi-gold/20 text-safi-gold",
    eligibility: ["Kenyan citizen 21+", "Stable employment or business", "Credit history check"],
    repayment: "3 – 12 months",
    docs: ["National ID copy", "3-month bank statement", "Employment letter / Business permit"],
  },
];

const Services = () => (
  <Layout>
    {/* Header */}
    <section className="bg-gradient-to-br from-primary to-safi-blue-dark text-primary-foreground py-20">
      <div className="container text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Our Loan Products</h1>
        <p className="opacity-80 max-w-lg mx-auto">Flexible loan options designed to match your financial needs. Transparent rates, clear terms.</p>
      </div>
    </section>

    {/* Loan Tier Details */}
    <Section>
      <div className="container space-y-10">
        {tiers.map((tier, i) => (
          <Card key={tier.title} className="overflow-hidden border-border/60">
            <div className="md:flex">
              <div className={`p-8 md:w-1/3 flex flex-col justify-center ${i % 2 === 0 ? "bg-muted/50" : "bg-card"}`}>
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tier.color} mb-4`}>
                  <tier.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl mb-2">{tier.title}</CardTitle>
                <p className="text-3xl font-heading font-bold text-foreground">{tier.range}</p>
                <p className="text-sm text-muted-foreground mt-1">Interest: <span className="font-semibold text-secondary">{tier.interest}</span></p>
                <p className="text-sm text-muted-foreground">Repayment: {tier.repayment}</p>
                <Button asChild className="mt-6 w-fit">
                  <Link to="/apply">Apply Now <ChevronRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
              <CardContent className="p-8 md:w-2/3 space-y-6">
                <div>
                  <h4 className="font-heading font-semibold mb-3">Eligibility</h4>
                  <ul className="space-y-2">
                    {tier.eligibility.map((e) => (
                      <li key={e} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary shrink-0" /> {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-semibold mb-3">Required Documents</h4>
                  <ul className="space-y-2">
                    {tier.docs.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </Section>

    {/* Comparison Table */}
    <Section className="bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Compare Loan Tiers</h2>
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Starter</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Amount", "Ksh 5.5K–25K", "Ksh 25.5K–65K", "Ksh 75.5K–124.5K"],
                ["Interest Rate", "3%", "3%", "3%"],
                ["Repayment", "1–3 months", "1–6 months", "3–12 months"],
                ["Min. Age", "18", "18", "21"],
                ["Approval Time", "24 hours", "24 hours", "48 hours"],
              ].map(([label, ...vals]) => (
                <TableRow key={label}>
                  <TableCell className="font-medium">{label}</TableCell>
                  {vals.map((v, i) => (
                    <TableCell key={i}>{v}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Section>
  </Layout>
);

export default Services;
