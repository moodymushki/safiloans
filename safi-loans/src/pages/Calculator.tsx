import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import PageHero from "@/components/layout/PageHero";

const Calculator = () => {
  const [amount, setAmount] = useState(25000);
  const [months, setMonths] = useState(3);
  const interestRate = 0.03; // 3%

  const totalInterest = amount * interestRate * months;
  const totalPayable = amount + totalInterest;
  const monthlyPayment = totalPayable / months;

  const chartData = [
    { name: "Principal", value: amount },
    { name: "Interest", value: totalInterest },
  ];
  const COLORS = ["hsl(210,80%,42%)", "hsl(160,45%,40%)"];

  return (
    <Layout>
      <PageHero
        title="Loan Calculator"
        subtitle="Estimate your repayments before you apply. Adjust the amount and period below."
        imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80"
        caption="Plan before you apply"
        imagePosition="center"
      />

      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label>Loan Amount: <span className="font-bold text-primary">Ksh {amount.toLocaleString()}</span></Label>
                  <Slider
                    value={[amount]}
                    onValueChange={(v) => setAmount(v[0])}
                    min={5500}
                    max={124500}
                    step={500}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ksh 5,500</span>
                    <span>Ksh 124,500</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Repayment Period: <span className="font-bold text-primary">{months} month{months > 1 ? "s" : ""}</span></Label>
                  <Slider
                    value={[months]}
                    onValueChange={(v) => setMonths(v[0])}
                    min={1}
                    max={12}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 month</span>
                    <span>12 months</span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span className="font-bold text-lg">Ksh {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-semibold text-secondary">Ksh {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="text-muted-foreground">Total Payable</span>
                    <span className="font-bold text-lg text-primary">Ksh {totalPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="border-border/60 flex flex-col items-center justify-center">
              <CardHeader>
                <CardTitle className="text-center">Repayment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `Ksh ${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Calculator;
