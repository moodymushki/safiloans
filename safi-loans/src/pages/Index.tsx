import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, TrendingDown, Lock, Star, ArrowRight, Wallet, Briefcase, Banknote, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AnimatedCounter from "@/components/home/AnimatedCounter";
import Layout from "@/components/layout/Layout";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section
      ref={ref}
      className={`py-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
};

const loanTiers = [
  { title: "Starter Loan", range: "Ksh 5,500 – 25,000", interest: "3%", icon: Wallet, color: "bg-primary/10 text-primary" },
  { title: "Growth Loan", range: "Ksh 25,500 – 65,070", interest: "3%", icon: Briefcase, color: "bg-secondary/10 text-secondary" },
  { title: "Premium Loan", range: "Ksh 75,500 – 124,500", interest: "3%", icon: Banknote, color: "bg-safi-gold/20 text-safi-gold" },
];

const testimonials = [
  { name: "Mary Wanjiku", quote: "Safi Loans processed my application in just 24 hours. The interest rate is very fair and the team is professional.", rating: 5 },
  { name: "James Odhiambo", quote: "I was able to expand my business thanks to a quick loan from Safi. Highly recommended for any Kenyan entrepreneur.", rating: 5 },
  { name: "Grace Muthoni", quote: "Transparent process, no hidden fees. I've used Safi Loans three times now and will continue to trust them.", rating: 4 },
];

const heroImageUrl = "https://images.pexels.com/photos/17272256/pexels-photo-17272256.jpeg?cs=srgb&dl=pexels-antonio-ribeiro-2267606-17272256.jpg&fm=jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-safi-blue-dark text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-safi-blue-dark/95 via-primary/85 to-primary/75 lg:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160,45%,40%,0.15),transparent_50%)]" />
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[radial-gradient(circle_at_center,hsl(205,90%,70%,0.18),transparent_62%)] lg:block" />
        <div className="container relative grid items-center gap-12 pt-12 pb-16 md:pt-16 md:pb-24 lg:min-h-[620px] lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] lg:pt-10">
          <div className="max-w-2xl space-y-6 animate-fade-in lg:self-start lg:pt-10">
            <div className="space-y-5">
              <span className="inline-block rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                Trusted by 5,000+ people across East Africa
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight">
                Fast & Affordable <br />Loans for Everyone
              </h1>
              <p className="text-lg opacity-80 max-w-lg leading-relaxed">
                Get the funding you need with competitive rates starting at 3% interest. Quick approval, flexible repayment, zero hassle.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 sm:flex sm:flex-wrap sm:gap-4">
                <Button size="lg" variant="secondary" asChild className="px-3 text-sm font-semibold text-secondary-foreground sm:px-8 sm:text-base">
                  <Link to="/apply">Apply for a Loan <ArrowRight className="ml-1 hidden h-4 w-4 sm:inline-block" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground bg-primary-foreground px-3 text-sm text-primary hover:bg-primary-foreground/90 hover:text-safi-blue-dark sm:px-8 sm:text-base">
                  <Link to="/services">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative hidden animate-fade-in-right lg:block">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-secondary/25 blur-2xl" />
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-foreground/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-2xl shadow-safi-blue-dark/40 backdrop-blur">
              <img
                src={heroImageUrl}
                alt="Black professionals smiling and holding smartphones"
                className="h-[430px] w-full rounded-[1.5rem] object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-safi-blue-dark/45 via-transparent to-primary/10" />
              <div className="absolute bottom-8 left-8 rounded-2xl border border-primary-foreground/20 bg-safi-blue-dark/75 px-5 py-4 shadow-xl backdrop-blur-md">
                <p className="text-sm opacity-80">Digital loan access</p>
                <p className="font-heading text-2xl font-bold">Simple. Fast. Secure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-muted border-b border-border">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 5000, suffix: "+", label: "Loans Issued" },
            { value: 99, suffix: "%", label: "Approval Rate" },
            { value: 24, suffix: "hrs", label: "Fast Approval" },
            { value: 3, suffix: "%", label: "Interest Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-heading font-bold text-primary">
                {s.value > 0 ? <AnimatedCounter end={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <Section>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Our Loan Products</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Choose the loan tier that fits your needs. Simple, transparent, and affordable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {loanTiers.map((tier) => (
              <Card key={tier.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/60">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tier.color} mb-3`}>
                    <tier.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{tier.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-heading font-bold text-foreground">{tier.range}</p>
                  <p className="text-sm text-muted-foreground">Interest rate from <span className="font-semibold text-secondary">{tier.interest}</span></p>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to="/apply">Apply Now <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Why Choose Safi Loans?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">We make borrowing simple, safe, and stress-free.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Fast Approval", desc: "Get your loan approved within 24 hours of application." },
              { icon: TrendingDown, title: "Low Interest", desc: "Competitive rates starting at just 3% per period." },
              { icon: Shield, title: "Flexible Repayment", desc: "Choose a repayment plan that works for your budget." },
              { icon: Lock, title: "Secure Process", desc: "Your data is protected with bank-level security." },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3 p-6 rounded-xl bg-card border border-border/60 hover:shadow-md transition-shadow">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/60">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-safi-gold text-safi-gold" : "text-border"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                  <p className="font-heading font-semibold text-sm">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary to-safi-blue-dark text-primary-foreground">
        <div className="container py-16 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Ready to Get Started?</h2>
          <p className="opacity-80 max-w-md mx-auto">Apply for a loan today and get approved within 24 hours. No hidden fees, no surprises.</p>
          <Button size="lg" variant="secondary" asChild className="text-secondary-foreground font-semibold">
            <Link to="/apply">Apply Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
