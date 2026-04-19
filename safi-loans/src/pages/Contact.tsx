import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import PageHero from "@/components/layout/PageHero";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className={`py-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </section>
  );
};

const faqs = [
  { q: "What do I need to apply for a loan?", a: "You need a valid Kenyan national ID, proof of income (pay slip or M-Pesa statement), and an active M-Pesa account or bank account." },
  { q: "How long does loan approval take?", a: "Most loans are approved within 24 hours. Premium loans may take up to 48 hours due to additional verification." },
  { q: "What is the interest rate?", a: "Our interest rate starts at 0.21% per period across all loan tiers. The exact rate depends on the loan amount and repayment period." },
  { q: "Can I repay my loan early?", a: "Yes! Early repayment is encouraged and there are no penalties for paying off your loan ahead of schedule." },
  { q: "What happens if I miss a payment?", a: "We understand that circumstances can change. Contact us immediately if you anticipate a missed payment and we'll work with you on a revised plan." },
  { q: "Is there a processing fee?", a: "Yes, a small processing fee applies to each loan application. The fee varies by loan tier and is clearly disclosed before you submit your application." },
];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: save to database when Cloud is enabled
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <PageHero
        title="Contact Us"
        subtitle="Have questions? We're here to help. Reach out and we'll respond promptly."
        imageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
        imageAlt="Customer support workspace with a laptop"
        caption="Support when you need it"
        imagePosition="center"
      />

      <Section>
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required maxLength={255} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+254 700 000 501" required maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="How can we help you?" rows={4} required maxLength={1000} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : <>Send Message <Send className="ml-1 h-4 w-4" /></>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info + Map */}
            <div className="space-y-6">
              <Card className="border-border/60">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">+254 700 000 501</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">info@safiloans.co.ke</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">Nairobi CBD, Kenya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <div className="rounded-xl bg-muted border border-border/60 h-48 flex items-center justify-center text-muted-foreground text-sm">
                <MapPin className="h-5 w-5 mr-2" /> Map — East Africa
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-muted/50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/60 rounded-xl px-6">
                <AccordionTrigger className="text-left font-heading font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </Layout>
  );
};

export default Contact;
