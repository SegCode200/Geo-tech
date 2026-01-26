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
    applicationNumber: string;
    status: "APPROVED" | "DRAFT" | "NEEDS_CORRECTION" | "IN_REVIEW" | "RESUBMITTED" | "REJECTED" | "SUBMITTED" ;
    submittedAt: string;
    paymentStatus: "SUCCESS" | "UNPAID";
  }[];
  recentPayments: {
    reference: string;
    amount: number;
    status: "SUCCESS" | "FAILED" | "PENDING" ;
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