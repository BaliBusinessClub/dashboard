"use client";

export type PartnerApplication = {
  id: string;
  name: string;
  offer: string;
  url: string;
  whatsapp: string;
  logo?: string;
  source: string;
  status: "pending" | "approved" | "declined";
};

const PENDING_KEY = "bbc-partner-pending";
const REVIEWED_KEY = "bbc-partner-reviewed";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPendingPartners() {
  return read<PartnerApplication>(PENDING_KEY);
}

export function getApprovedPartners() {
  return read<PartnerApplication>(REVIEWED_KEY).filter((item) => item.status === "approved");
}

export function submitPartnerApplication(partner: Omit<PartnerApplication, "id" | "status" | "source">) {
  const nextPartner: PartnerApplication = {
    ...partner,
    id: `partner-${Date.now()}`,
    source: "BBC member application",
    status: "pending"
  };

  write(PENDING_KEY, [nextPartner, ...getPendingPartners()]);
  return nextPartner;
}

export function reviewPartnerApplication(id: string, decision: "approved" | "declined") {
  const pending = getPendingPartners();
  const current = pending.find((item) => item.id === id);
  if (!current) {
    return null;
  }
  write(
    PENDING_KEY,
    pending.filter((item) => item.id !== id)
  );
  const reviewed = read<PartnerApplication>(REVIEWED_KEY);
  const nextReviewed = { ...current, status: decision };
  write(REVIEWED_KEY, [nextReviewed, ...reviewed]);
  return nextReviewed;
}
