import api, { normalizeAxiosError } from "./auth";



export type DashboardOverviewResponse = {
  stats: {
    totalLands: number;
    totalApplications: number;
    approvedCofO: number;
    pendingCofO: number;
    rejectedCofO: number;
  };
  recentApplications: {
    id: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    submittedAt: string;
    paymentStatus: "PAID" | "UNPAID";
  }[];
  recentPayments: {
    reference: string;
    amount: number;
    status: "PAID" | "FAILED" | "PENDING";
    date: string;
  }[];
};export async function fetchDashboardOverview(): Promise<DashboardOverviewResponse> {
  try {
    const res = await api.get("/user/dashboard-overview");
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}