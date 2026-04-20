import api, { normalizeAxiosError } from "./auth";

// Types
export interface InitiateTransferRequest {
  landId: string;
  newOwnerEmail?: string;
  newOwnerPhone?: string;
  transferType: "FULL" | "PARTIAL";
  transferSurveyType?: "COORDINATE" | "BEARING";
  coordinates?: number[][];
  bearings?: Array<{ distance: number; bearing: number }>;
  startPoint?: [number, number];
  utmZone?: string;
  measuredAreaSqm?: number;
}

export interface InitiateTransferResponse {
  message: string;
  transferId: string;
  expiresAt: string;
  verificationChannels: number;
}

export interface VerifyOTPRequest {
  transferId: string;
  target: string;
  code: string;
}

export interface VerifyOTPResponse {
  message: string;
  verified: boolean;
  allPartiesVerified: boolean;
  remainingVerifications: number;
}

export interface SubmitDocumentsRequest {
  transferId: string;
  files: File[];
  documentsMeta: Array<{
    type: string;
    title: string;
  }>;
}

export interface SubmitDocumentsResponse {
  message: string;
  transferId: string;
  documentsCount: number;
}

export interface TransferDetailsResponse {
  transferId: string;
  landId: string;
  transferType: "FULL" | "PARTIAL";
  status: string;
  currentOwnerId: string;
  newOwnerEmail?: string;
  newOwnerPhone?: string;
  createdAt: string;
  expiresAt: string;
}

export interface TransferProgressResponse {
  transferId: string;
  currentStatus: string;
  progressPercentage: number;
  stages: Array<{
    stage: string;
    completed: boolean;
    completedAt?: string;
    progress?: number;
    details?: {
      verified?: number;
      total?: number;
      approved?: number;
      rejected?: number;
      pending?: number;
    };
    submittedDocuments?: number;
  }>;
  landDetails: {
    id: string;
    address: string;
    size: number;
    state: string;
  };
  timestamps: {
    createdAt: string;
    reviewedAt: string | null;
    expiresAt: string;
  };
  recentActivity: Array<{
    action: string;
    date: string;
    comment: string;
  }>;
}

export interface TransferListResponse {
  summary: {
    total: number;
    initiated: number;
    verifiedByParties: number;
    pendingGovernor: number;
    approved: number;
    rejected: number;
    expired: number;
  };
  transfers: TransferItem[];
}

export interface TransferItem {
  id: string;
  landId: string;
  status: "INITIATED" | "VERIFIED_BY_PARTIES" | "PENDING_GOVERNOR" | "APPROVED" | "REJECTED" | "EXPIRED";
  createdAt: string;
  reviewedAt?: string;
  expiresAt: string;
  userRole: "CURRENT_OWNER" | "NEW_OWNER";
  land: {
    id: string;
    address: string;
    areaSqm: number;
    state: string;
    ownerName: string;
  };
  documents?: Array<any>;
  documentation?: {
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  verification?: {
    verified: number;
    total: number;
    progress: number;
  };
  progressPercentage: number;
}

// API Calls
export async function initiateOwnershipTransfer(
  data: InitiateTransferRequest
): Promise<InitiateTransferResponse> {
  try {
    const res = await api.post("/ownership/initiate", data);
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function verifyTransferOTP(
  data: VerifyOTPRequest
): Promise<VerifyOTPResponse> {
  try {
    const res = await api.post("/ownership/verify", data);
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function resendTransferOTP(
  transferId: string,
  target: string
): Promise<{ message: string }> {
  try {
    const res = await api.post(`/ownership/${transferId}/resend-otp`, { target });
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function submitTransferDocuments(
  data: SubmitDocumentsRequest
): Promise<SubmitDocumentsResponse> {
  try {
    const formData = new FormData();
    formData.append("transferId", data.transferId);
    formData.append("documentsMeta", JSON.stringify(data.documentsMeta));

    data.files.forEach((file) => {
      formData.append("documents", file);
    });

    const res = await api.post(
      `/ownership/${data.transferId}/upload-documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function getTransferDetails(
  transferId: string
): Promise<TransferDetailsResponse> {
  try {
    const res = await api.get(`/ownership/${transferId}/details`);
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function getTransferProgress(
  transferId: string
): Promise<TransferProgressResponse> {
  try {
    const res = await api.get(`/ownership/${transferId}/progress`);
    const data = res.data;
    console.log("Transfer Progress:", data);
    if (Array.isArray(data)) {
      return data[0];
    }
    if (data?.transfers) {
      return data.transfers[0];
    }
    return data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function listUserTransfers(): Promise<TransferListResponse> {
  try {
    const res = await api.get("/ownership/user-transfers");
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function getLandsByUser() {
  try {
    const res = await api.get("/lands/get-user-lands");
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}
