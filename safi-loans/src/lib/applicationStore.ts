export interface ApplicationRecord {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  employer: string;
  jobTitle: string;
  monthlyIncome: string;
  employmentDuration: string;
  loanAmount: number;
  loanPurpose: string;
  repaymentPeriod: string;
  processingFee: number;
  mpesaNumber: string;
  additionalInfo: string;
  paidAt: string;
  submittedAt: string;
  idDocument?: string;
  paymentCheckoutId?: string;
  paymentReceipt?: string;
}

interface AdminCreds {
  username: string;
  password: string;
}

interface DashboardMetrics {
  totalApplicants: number;
  totalRevenue: number;
  totalLoansRequested: number;
  averageFeePerApplicant: number;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/, "");

const parseNumber = (value: unknown): number => Number(value || 0);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(`Network error: ${(error as Error).message}`);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export const adminLogin = async (username: string, password: string): Promise<{ authenticated: boolean; username?: string }> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/admin/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.replace(/\s+/g, ""), password: password.trim() }),
    });
  } catch (error) {
    throw new Error(`Network error: ${(error as Error).message}`);
  }

  if (response.status === 401) {
    return { authenticated: false };
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }

  return (await response.json()) as { authenticated: boolean; username?: string };
};

export const getAdminProfile = async (): Promise<{ username: string }> => {
  return request("/admin/profile/");
};

export const updateAdminCreds = async (creds: AdminCreds): Promise<void> => {
  await request("/admin/profile/", {
    method: "PUT",
    body: JSON.stringify(creds),
  });
};

export const getApplications = async (): Promise<ApplicationRecord[]> => {
  const data = await request<ApplicationRecord[]>("/applications/");
  return data.map((app) => ({
    ...app,
    loanAmount: parseNumber(app.loanAmount),
    processingFee: parseNumber(app.processingFee),
    monthlyIncome: String(app.monthlyIncome || ""),
    repaymentPeriod: String(app.repaymentPeriod || ""),
    idDocument: app.idDocument ? (app.idDocument.startsWith("http") ? app.idDocument : `${API_ORIGIN}${app.idDocument}`) : undefined,
    paymentCheckoutId: app.paymentCheckoutId || "",
    paymentReceipt: app.paymentReceipt || "",
  }));
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const data = await request<DashboardMetrics>("/dashboard/metrics/");
  return {
    totalApplicants: parseNumber(data.totalApplicants),
    totalRevenue: parseNumber(data.totalRevenue),
    totalLoansRequested: parseNumber(data.totalLoansRequested),
    averageFeePerApplicant: parseNumber(data.averageFeePerApplicant),
  };
};

export const addApplication = async (
  record: Omit<ApplicationRecord, "id" | "submittedAt" | "idDocument">,
  idFile?: File | null,
): Promise<ApplicationRecord> => {
  const formData = new FormData();
  formData.append("fullName", record.fullName);
  formData.append("email", record.email);
  formData.append("phone", record.phone);
  formData.append("idNumber", record.idNumber);
  formData.append("dateOfBirth", record.dateOfBirth);
  formData.append("address", record.address || "");
  formData.append("employer", record.employer);
  formData.append("jobTitle", record.jobTitle);
  formData.append("monthlyIncome", String(record.monthlyIncome));
  formData.append("employmentDuration", record.employmentDuration || "");
  formData.append("loanAmount", String(record.loanAmount));
  formData.append("loanPurpose", record.loanPurpose);
  formData.append("repaymentPeriod", String(record.repaymentPeriod));
  formData.append("processingFee", String(record.processingFee));
  formData.append("mpesaNumber", record.mpesaNumber);
  formData.append("additionalInfo", record.additionalInfo || "");
  formData.append("paidAt", record.paidAt);
  formData.append("paymentCheckoutId", record.paymentCheckoutId || "");
  formData.append("paymentReceipt", record.paymentReceipt || "");

  if (idFile) {
    formData.append("idDocument", idFile);
  }

  return request("/applications/", {
    method: "POST",
    body: formData,
  });
};
