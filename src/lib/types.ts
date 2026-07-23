export type UserRole = "family" | "counselor" | "admin";
export type CounselorStatus = "pending" | "approved" | "rejected";
export type RequestStatus = "open" | "matched" | "closed";
export type ApplicationStatus = "pending" | "matched" | "rejected";

export type Profile = {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  created_at: string;
};

export type CounselorProfile = {
  id: string;
  qualifications: string | null;
  experience_years: number | null;
  areas: string[] | null;
  bio: string | null;
  certificate_url: string | null;
  status: CounselorStatus;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  profiles?: Profile;
};

export type FamilyRequest = {
  id: string;
  family_id: string;
  title: string;
  area: string;
  support_type: string;
  frequency: string | null;
  budget: string | null;
  memo: string | null;
  status: RequestStatus;
  created_at: string;
};

export type Application = {
  id: string;
  request_id: string;
  counselor_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
  counselor_profiles?: CounselorProfile;
};

export type Match = {
  id: string;
  request_id: string;
  family_id: string;
  counselor_id: string;
  matched_at: string;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type FeeSettings = {
  id: number;
  monthly_fee: number;
  updated_at: string;
};
