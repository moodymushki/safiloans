import { useCallback, useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronLeft, ChevronRight, Upload, FileText, X, AlertCircle, Smartphone, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addApplication } from "@/lib/applicationStore";

const steps = ["Personal Info", "Employment", "Loan Details & ID Upload", "Payment & Submit"];
const MPESA_TILL_NUMBER = "5378522";
const PAYMENT_METHOD_LABEL = `Till ${MPESA_TILL_NUMBER}`;
const PROCESSING_FEE_RATE = 0.05;
const PROCESSING_FEE_PERCENT_LABEL = "5%";

const normalizeTransactionCode = (value: string) => value.trim().replace(/\s+/g, "").toUpperCase();

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  if (birthDate > today) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < birthdayThisYear) age -= 1;

  return age;
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const LoanApplication = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [confirmingTransactionCode, setConfirmingTransactionCode] = useState(false);
  const [transactionCodeInput, setTransactionCodeInput] = useState("");
  const [paymentCheckoutId, setPaymentCheckoutId] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    dateOfBirth: "",
    address: "",
    employer: "",
    jobTitle: "",
    monthlyIncome: "",
    employmentDuration: "",
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    additionalInfo: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const processingFee = form.loanAmount ? Math.ceil(Number(form.loanAmount) * PROCESSING_FEE_RATE) : 0;
  const applicantAge = calculateAge(form.dateOfBirth);
  const isApplicantAdult = applicantAge !== null && applicantAge >= 18;
  const hasInvalidDateOfBirth = Boolean(form.dateOfBirth) && applicantAge === null;
  const todayInputValue = formatDateInput(new Date());

  useEffect(() => {
    setPaymentVerified(false);
    setPaymentCheckoutId("");
    setPaymentReceipt("");
    setTransactionCodeInput("");
    setConfirmingTransactionCode(false);
    setPaymentDialogOpen(false);
  }, [processingFee]);

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [submitted]);

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone && form.idNumber && form.dateOfBirth && isApplicantAdult;
    if (step === 1) return form.employer && form.jobTitle && form.monthlyIncome;
    if (step === 2) return form.loanAmount && form.loanPurpose && form.repaymentPeriod && idFile;
    return true;
  };

  const handleDateOfBirthChange = (value: string) => {
    update("dateOfBirth", value);

    const age = calculateAge(value);
    if (value && age !== null && age < 18) {
      toast({
        title: "Age requirement not met",
        description: "Applicants must be 18 years or older to apply for a loan.",
        variant: "destructive",
      });
    } else if (value && age === null) {
      toast({
        title: "Invalid date of birth",
        description: "Please enter a valid date of birth before continuing.",
        variant: "destructive",
      });
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setIdFile(file);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file only.", variant: "destructive" });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setIdFile(file);
    } else if (file) {
      toast({ title: "Invalid file", description: "Please upload a PDF file only.", variant: "destructive" });
    }
  };

  const handleTransactionCodeReview = () => {
    const normalizedCode = normalizeTransactionCode(transactionCodeInput);
    if (!/^[A-Z0-9]{6,30}$/.test(normalizedCode)) {
      toast({
        title: "Invalid transaction code",
        description: "Please enter the M-Pesa transaction code exactly as shown in your payment message.",
        variant: "destructive",
      });
      return;
    }
    setTransactionCodeInput(normalizedCode);
    setConfirmingTransactionCode(true);
    toast({
      title: "Confirm transaction code",
      description: `Please confirm ${normalizedCode} is correct before completing your application.`,
    });
  };

  const handleConfirmTransactionCode = () => {
    const normalizedCode = normalizeTransactionCode(transactionCodeInput);
    setPaymentVerified(true);
    setPaymentReceipt(normalizedCode);
    setPaymentCheckoutId(`MANUAL-${normalizedCode}`);
    setConfirmingTransactionCode(false);
    setPaymentDialogOpen(false);
    toast({
      title: "Transaction code saved",
      description: "Your payment code has been recorded and will be reviewed with your application.",
    });
  };

  const handleSubmit = async () => {
    if (!paymentVerified) {
      toast({ title: "Payment Required", description: "Please pay to the till and confirm your transaction code before submitting.", variant: "destructive" });
      return;
    }
    if (!paymentReceipt || !paymentCheckoutId) {
      toast({ title: "Transaction code required", description: "Please enter and confirm your M-Pesa transaction code.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      await addApplication({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        idNumber: form.idNumber,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        employer: form.employer,
        jobTitle: form.jobTitle,
        monthlyIncome: form.monthlyIncome,
        employmentDuration: form.employmentDuration,
        loanAmount: Number(form.loanAmount),
        loanPurpose: form.loanPurpose,
        repaymentPeriod: form.repaymentPeriod,
        processingFee,
        mpesaNumber: PAYMENT_METHOD_LABEL,
        additionalInfo: form.additionalInfo,
        paidAt: new Date().toISOString(),
        paymentCheckoutId,
        paymentReceipt,
      }, idFile);

      setSubmitted(true);
      toast({ title: "Application submitted!", description: "We'll review your application and payment details, then contact you within 24 hours." });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: (error as Error).message || "Could not submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-32">
          <div className="container max-w-lg text-center space-y-6 animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-heading font-bold">Application Submitted!</h1>
            <p className="text-muted-foreground">
              Thank you for your application. Your payment will be reviewed together with your transaction code
              {paymentReceipt ? ` (${paymentReceipt})` : ""} and application details, then our team will get in touch within 24 hours.
            </p>
            <Button asChild variant="outline">
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary to-safi-blue-dark text-primary-foreground py-16">
        <div className="container text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-2">Loan Application</h1>
          <p className="opacity-80">Complete the form below to apply for a loan.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm hidden sm:inline ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`mx-3 h-0.5 w-8 sm:w-16 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>{steps[step]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 0: Personal Info */}
              {step === 0 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Kamau" required maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" required maxLength={255} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254 700 000 501" required maxLength={20} />
                    </div>
                    <div className="space-y-2">
                      <Label>National ID Number *</Label>
                      <Input value={form.idNumber} onChange={(e) => update("idNumber", e.target.value)} placeholder="12345678" required maxLength={20} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => handleDateOfBirthChange(e.target.value)}
                        max={todayInputValue}
                        required
                      />
                      {form.dateOfBirth && applicantAge !== null && (
                        <p className={`text-xs ${isApplicantAdult ? "text-muted-foreground" : "text-destructive"}`}>
                          {isApplicantAdult
                            ? `Applicant age: ${applicantAge} years.`
                            : `Applicant age: ${applicantAge} years. You must be 18 years or older to apply.`}
                        </p>
                      )}
                      {hasInvalidDateOfBirth && (
                        <p className="text-xs text-destructive">Please enter a valid date of birth.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Residential Address</Label>
                      <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Nairobi, Kenya" maxLength={200} />
                    </div>
                  </div>
                </>
              )}

              {/* Step 1: Employment */}
              {step === 1 && (
                <>
                  <Alert className="border-primary/30 bg-primary/5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <strong>Emergency & Self-Employed Loans:</strong> If you are self-employed or applying for an emergency loan, you are also eligible. 
                      Please enter your business name as the employer and "Self-Employed" or "Business Owner" as your job title. 
                      Emergency loan applicants can select "Emergency" as the loan purpose in the next step.
                    </AlertDescription>
                  </Alert>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employer / Business Name *</Label>
                      <Input value={form.employer} onChange={(e) => update("employer", e.target.value)} placeholder="Company Ltd / Your Business" required maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title / Role *</Label>
                      <Input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Accountant / Self-Employed" required maxLength={100} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Income (Ksh) *</Label>
                      <Input type="number" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} placeholder="50000" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Employment Duration</Label>
                      <Select value={form.employmentDuration} onValueChange={(v) => update("employmentDuration", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1–3 years</SelectItem>
                          <SelectItem value="3-5">3–5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Loan Details & ID Upload */}
              {step === 2 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Loan Amount (Ksh) *</Label>
                      <Input type="number" value={form.loanAmount} onChange={(e) => update("loanAmount", e.target.value)} placeholder="25000" min={5500} max={124500} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Repayment Period *</Label>
                      <Select value={form.repaymentPeriod} onValueChange={(v) => update("repaymentPeriod", v)}>
                        <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 6, 9, 12].map((m) => (
                            <SelectItem key={m} value={String(m)}>{m} month{m > 1 ? "s" : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Purpose *</Label>
                    <Select value={form.loanPurpose} onValueChange={(v) => update("loanPurpose", v)}>
                      <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Use</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Processing Fee Preview */}
                  {form.loanAmount && (
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Fee ({PROCESSING_FEE_PERCENT_LABEL} of loan)</span>
                        <span className="font-bold text-primary">Ksh {processingFee.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">You will pay this fee via M-Pesa in the next step before submitting.</p>
                    </div>
                  )}

                  {/* ID Upload */}
                  <div className="space-y-2">
                    <Label>Upload National ID (PDF — Front & Back) *</Label>
                    <p className="text-xs text-muted-foreground">Please scan or photograph both the front and back of your National ID and combine them into a single PDF file.</p>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                        dragOver ? "border-primary bg-primary/5" : idFile ? "border-secondary bg-secondary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => document.getElementById("id-file-input")?.click()}
                    >
                      <input
                        id="id-file-input"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      {idFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-secondary" />
                          <div className="text-left">
                            <p className="font-medium text-sm">{idFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(idFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); setIdFile(null); }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">Drag & drop your ID PDF here</p>
                          <p className="text-xs text-muted-foreground">or click to browse • PDF only, max 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Information</Label>
                    <Textarea value={form.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)} placeholder="Any additional details..." maxLength={500} />
                  </div>
                </>
              )}

              {/* Step 3: Payment & Review */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <p className="text-sm text-muted-foreground">Please review your details, pay the processing fee to the till below, then confirm your transaction code before submitting.</p>
                  <div className="rounded-xl bg-muted p-6 space-y-3 text-sm">
                    {[
                      ["Full Name", form.fullName],
                      ["Email", form.email],
                      ["Phone", form.phone],
                      ["ID Number", form.idNumber],
                      ["Date of Birth", form.dateOfBirth],
                      ["Employer", form.employer],
                      ["Job Title", form.jobTitle],
                      ["Monthly Income", `Ksh ${Number(form.monthlyIncome).toLocaleString()}`],
                      ["Loan Amount", `Ksh ${Number(form.loanAmount).toLocaleString()}`],
                      ["Repayment Period", `${form.repaymentPeriod} month(s)`],
                      ["Purpose", form.loanPurpose],
                      ["Processing Fee", `Ksh ${processingFee.toLocaleString()}`],
                      ["ID Document", idFile?.name || "—"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-1 border-b border-border/50 pb-2 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="min-w-0 break-words font-medium text-foreground sm:text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* M-Pesa Till Payment Section */}
                  <Card className={`border-2 ${paymentVerified ? "border-secondary bg-secondary/5" : "border-primary/30"}`}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <h3 className="font-heading font-semibold">M-Pesa Till Payment</h3>
                      </div>

                      {paymentVerified ? (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10">
                          <CheckCircle className="h-6 w-6 text-secondary" />
                          <div>
                            <p className="font-semibold text-secondary">Transaction Code Recorded</p>
                            <p className="text-sm text-muted-foreground">Payment of Ksh {processingFee.toLocaleString()} to {PAYMENT_METHOD_LABEL} will be reviewed.</p>
                            {paymentReceipt ? <p className="text-xs text-muted-foreground">Transaction code: {paymentReceipt}</p> : null}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-lg bg-muted p-4 text-center">
                            <p className="text-sm text-muted-foreground">Processing Fee</p>
                            <p className="text-3xl font-heading font-bold text-primary">Ksh {processingFee.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">{PROCESSING_FEE_PERCENT_LABEL} of Ksh {Number(form.loanAmount).toLocaleString()} loan amount</p>
                          </div>

                          <div className="rounded-xl border bg-background p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-muted-foreground">Payment method</span>
                              <span className="font-semibold">Buy Goods and Services</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-muted-foreground">Till number</span>
                              <span className="font-heading text-2xl font-bold text-primary">{MPESA_TILL_NUMBER}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-muted-foreground">Amount to pay</span>
                              <span className="font-semibold">Ksh {processingFee.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              On your phone, open M-Pesa, choose Lipa na M-Pesa, select Buy Goods and Services, enter till {MPESA_TILL_NUMBER}, pay Ksh {processingFee.toLocaleString()}, then enter the transaction code from the SMS.
                            </p>
                          </div>

                          <Button
                            onClick={() => {
                              setConfirmingTransactionCode(false);
                              setPaymentDialogOpen(true);
                            }}
                            className="w-full whitespace-normal text-sm leading-tight sm:text-base"
                            size="lg"
                          >
                            Proceed to Enter Transaction Code
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{confirmingTransactionCode ? "Confirm Transaction Code" : "Enter M-Pesa Transaction Code"}</DialogTitle>
                        <DialogDescription>
                          {confirmingTransactionCode
                            ? "Please confirm the transaction code is correct before completing your application."
                            : `After paying Ksh ${processingFee.toLocaleString()} to till ${MPESA_TILL_NUMBER}, enter the M-Pesa transaction code from your SMS.`}
                        </DialogDescription>
                      </DialogHeader>

                      {confirmingTransactionCode ? (
                        <div className="space-y-4">
                          <div className="rounded-xl border bg-muted p-5 text-center">
                            <p className="text-sm text-muted-foreground">Transaction code to submit</p>
                            <p className="mt-2 text-3xl font-heading font-bold tracking-widest text-primary">{transactionCodeInput}</p>
                          </div>
                          <Alert className="border-primary/30 bg-primary/5">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-sm">
                              If this code is wrong, choose Edit Code. Incorrect codes may delay payment review and loan processing.
                            </AlertDescription>
                          </Alert>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>M-Pesa Transaction Code *</Label>
                          <Input
                            value={transactionCodeInput}
                            onChange={(e) => setTransactionCodeInput(e.target.value.toUpperCase())}
                            placeholder="e.g. SDE123ABC4"
                            maxLength={30}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter only the transaction code, not your M-Pesa PIN or message text.
                          </p>
                        </div>
                      )}

                      <DialogFooter className="flex-row gap-2 sm:gap-2">
                        {confirmingTransactionCode ? (
                          <>
                            <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => setConfirmingTransactionCode(false)}>
                              Edit Code
                            </Button>
                            <Button type="button" className="flex-1 sm:flex-none" onClick={handleConfirmTransactionCode}>
                              Confirm Code
                            </Button>
                          </>
                        ) : (
                          <Button type="button" onClick={handleTransactionCodeReview}>
                            Continue
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                {step < 3 ? (
                  <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading || !paymentVerified}>
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      "Complete Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default LoanApplication;
