import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Users, DollarSign, LogOut, Lock, User, Eye, EyeOff,
  FileText, Phone, Mail, Briefcase, Calendar, MapPin, Save, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import {
  adminLogin,
  getAdminProfile,
  getApplications,
  getDashboardMetrics,
  updateAdminCreds,
  type ApplicationRecord,
} from "@/lib/applicationStore";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Profile state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Expanded application detail
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [displayUsername, setDisplayUsername] = useState("");
  const [metrics, setMetrics] = useState({
    totalApplicants: 0,
    totalRevenue: 0,
    averageFeePerApplicant: 0,
    totalLoansRequested: 0,
  });

  const loadDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const [apps, metricData, profile] = await Promise.all([
        getApplications(),
        getDashboardMetrics(),
        getAdminProfile(),
      ]);
      setApplications(apps);
      setMetrics(metricData);
      setDisplayUsername(profile.username);
      setNewUsername(profile.username);
    } catch {
      toast({
        title: "Load failed",
        description: "Could not load dashboard data from backend.",
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      void loadDashboardData();
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;

    const endSession = () => {
      setAuthenticated(false);
      setUsername("");
      setPassword("");
      setNewPassword("");
      setError("");
      setApplications([]);
      setDisplayUsername("");
      setExpandedId(null);
      setShowPassword(false);
      setShowNewPassword(false);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) endSession();
    };

    window.addEventListener("pagehide", endSession);
    window.addEventListener("beforeunload", endSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", endSession);
      window.removeEventListener("beforeunload", endSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authenticated]);

  const handleLogin = async () => {
    try {
      const result = await adminLogin(username, password);
      if (!result.authenticated) {
        setError("Invalid credentials. Access denied.");
        return;
      }

      const loggedInUsername = result.username || username;
      setAuthenticated(true);
      setDisplayUsername(loggedInUsername);
      setNewUsername(loggedInUsername);
      setUsername("");
      setPassword("");
      setNewPassword("");
      setShowPassword(false);
      setError("");
    } catch {
      setError("Login failed. Check backend connection.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUsername("");
    setPassword("");
    setNewPassword("");
    setError("");
    setApplications([]);
    setDisplayUsername("");
    setExpandedId(null);
    setShowPassword(false);
    setShowNewPassword(false);
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({ title: "Error", description: "Username and password cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      await updateAdminCreds({ username: newUsername.trim(), password: newPassword.trim() });
      setDisplayUsername(newUsername.trim());
      setNewPassword("");
      setShowNewPassword(false);
      toast({ title: "Profile Updated", description: "Your credentials have been updated successfully." });
    } catch {
      toast({ title: "Update failed", description: "Could not update profile.", variant: "destructive" });
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-foreground to-foreground/90 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl font-heading">Management Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent className="pt-2">
            <form
              className="space-y-4"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                void handleLogin();
              }}
            >
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  name="safi-admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="safi-admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold leading-tight">Management Dashboard</h1>
              <p className="text-xs text-muted-foreground">Safi Loans Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex gap-1">
              <User className="h-3 w-3" /> {displayUsername}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Total Applicants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold">{metrics.totalApplicants}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold text-secondary">Ksh {metrics.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Avg Fee / Applicant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold text-primary">
                Ksh {Math.round(metrics.averageFeePerApplicant).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Total Loans Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold">
                Ksh {metrics.totalLoansRequested.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications" className="gap-1.5">
              <FileText className="h-4 w-4" /> Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-primary" /> Applicant Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-base font-medium">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-base font-medium">No applications recorded yet.</p>
                    <p className="text-sm mt-1">Successful applications will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Loan Amount</TableHead>
                          <TableHead>Fee Paid</TableHead>
                          <TableHead>Payment Code</TableHead>
                          <TableHead>ID PDF</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app, i) => (
                          <Fragment key={app.id}>
                            <TableRow
                              className="cursor-pointer hover:bg-muted/70"
                              onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                            >
                              <TableCell className="font-medium">{i + 1}</TableCell>
                              <TableCell className="font-medium">{app.fullName}</TableCell>
                              <TableCell>{app.phone}</TableCell>
                              <TableCell>Ksh {app.loanAmount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-semibold">
                                  Ksh {app.processingFee.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell>{app.paymentReceipt || "Pending review"}</TableCell>
                              <TableCell>
                                {app.idDocument ? (
                                  <a
                                    href={app.idDocument}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {expandedId === app.id ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                            </TableRow>
                            {expandedId === app.id && (
                              <TableRow key={`${app.id}-detail`}>
                                <TableCell colSpan={9} className="bg-muted/30 p-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-start gap-2">
                                      <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{app.email || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">ID Number:</span> <span className="font-medium">{app.idNumber || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{app.dateOfBirth || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Address:</span> <span className="font-medium">{app.address || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Briefcase className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Employer:</span> <span className="font-medium">{app.employer || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Briefcase className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Job Title:</span> <span className="font-medium">{app.jobTitle || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Monthly Income:</span> <span className="font-medium">Ksh {Number(app.monthlyIncome || 0).toLocaleString()}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Employment Duration:</span> <span className="font-medium">{app.employmentDuration || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Loan Purpose:</span> <span className="font-medium capitalize">{app.loanPurpose || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Repayment:</span> <span className="font-medium">{app.repaymentPeriod || "N/A"} month(s)</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Payment Method:</span> <span className="font-medium">{app.mpesaNumber || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Transaction Code:</span> <span className="font-medium">{app.paymentReceipt || "N/A"}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div><span className="text-muted-foreground">Payment Recorded:</span> <span className="font-medium">{new Date(app.paidAt).toLocaleString()}</span></div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                      <div>
                                        <span className="text-muted-foreground">ID Document:</span>{" "}
                                        {app.idDocument ? (
                                          <a
                                            href={app.idDocument}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                                          >
                                            View PDF
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        ) : (
                                          <span className="font-medium">N/A</span>
                                        )}
                                      </div>
                                    </div>
                                    {app.additionalInfo && (
                                      <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <div><span className="text-muted-foreground">Additional Info:</span> <span className="font-medium">{app.additionalInfo}</span></div>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-5 w-5 text-primary" /> Update Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    name="safi-admin-new-username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      name="safi-admin-new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
