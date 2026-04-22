"use client";

export type EventCategory = "Networking" | "Business" | "Wellness & Sport" | "Music & Culture";

export type DashboardEvent = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  description: string;
  signupUrl: string;
  whatsappUrl?: string;
  source: string;
  status: "approved" | "pending" | "declined";
};

const PENDING_KEY = "bbc-event-pending";
const REVIEWED_KEY = "bbc-event-reviewed";

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

export function getPendingEvents() {
  return read<DashboardEvent>(PENDING_KEY);
}

export function getReviewedEvents() {
  return read<DashboardEvent>(REVIEWED_KEY);
}

export function submitEvent(event: Omit<DashboardEvent, "id" | "status">) {
  const nextEvent: DashboardEvent = {
    ...event,
    id: `event-${Date.now()}`,
    status: "pending"
  };

  const current = getPendingEvents();
  write(PENDING_KEY, [nextEvent, ...current]);
  return nextEvent;
}

export function reviewEvent(id: string, decision: "approved" | "declined") {
  const pending = getPendingEvents();
  const current = pending.find((item) => item.id === id);
  if (!current) {
    return null;
  }

  write(
    PENDING_KEY,
    pending.filter((item) => item.id !== id)
  );

  const reviewed = getReviewedEvents();
  const nextReviewed: DashboardEvent = { ...current, status: decision };
  write(REVIEWED_KEY, [nextReviewed, ...reviewed]);
  return nextReviewed;
}
