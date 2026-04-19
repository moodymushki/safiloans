import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Eye, Heart, Users, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className={`py-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </section>
  );
};

const team = [
  { name: "John Kamau", role: "CEO & Founder" },
  { name: "Sarah Akinyi", role: "Head of Operations" },
  { name: "David Mwangi", role: "Finance Director" },
  { name: "Faith Njeri", role: "Customer Relations" },
];

const About = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-safi-blue-dark text-primary-foreground py-20">
      <div className="container text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">About Safi Loans</h1>
        <p className="opacity-80 max-w-lg mx-auto">Building financial bridges for Africans since 2018.</p>
      </div>
    </section>

    {/* Mission & Vision */}
    <Section>
      <div className="container grid md:grid-cols-2 gap-8 max-w-4xl">
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl">Our Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To provide accessible, transparent, and affordable financial solutions that empower individuals and small businesses across Kenya to achieve their goals.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl">Our Vision</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To be Kenya's most trusted lending partner, known for integrity, speed, and putting our clients' financial well-being first.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>

    {/* Story */}
    <Section className="bg-muted/50">
      <div className="container max-w-3xl text-center space-y-6">
        <h2 className="text-3xl font-heading font-bold">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed">
          Founded in 2018, Safi Loans Limited started with a simple idea — make borrowing fair and accessible. What began as a small lending circle in Nairobi has grown into a trusted institution serving thousands of clients. Our commitment to low rates, transparent processes, and exceptional customer service has earned us the trust of Kenyans from all walks of life.
        </p>
      </div>
    </Section>

    {/* Core Values */}
    <Section>
      <div className="container">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Integrity", desc: "Honest and transparent in every interaction." },
            { icon: Heart, title: "Compassion", desc: "Understanding our clients' unique situations." },
            { icon: Users, title: "Community", desc: "Building stronger communities through financial empowerment." },
            { icon: Award, title: "Excellence", desc: "Delivering the highest standard of service." },
          ].map((v) => (
            <div key={v.title} className="text-center p-6 rounded-xl bg-card border border-border/60 space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <v.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Team */}
    <Section className="bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <Card key={m.name} className="text-center border-border/60">
              <CardContent className="pt-6 space-y-3">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-heading font-bold">
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h4 className="font-heading font-semibold">{m.name}</h4>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  </Layout>
);

export default About;
