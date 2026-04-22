"use client";

export type InboxMessage = {
  id: string;
  type: "Partnerships" | "Contacting us" | "Recommendations";
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  date: string;
  status: "inbox" | "replied" | "archived";
};

const MESSAGE_KEY = "bbc-messages";

function read() {
  if (typeof window === "undefined") {
    return [] as InboxMessage[];
  }
  try {
    const raw = window.localStorage.getItem(MESSAGE_KEY);
    return raw ? (JSON.parse(raw) as InboxMessage[]) : [];
  } catch {
    return [];
  }
}

function write(messages: InboxMessage[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
}

export function getStoredMessages() {
  return read();
}

export function submitMessage(message: Omit<InboxMessage, "id" | "date" | "status">) {
  const nextMessage: InboxMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    status: "inbox"
  };
  write([nextMessage, ...read()]);
  return nextMessage;
}

export function updateMessageStatus(id: string, status: InboxMessage["status"]) {
  const updated = read().map((item) => (item.id === id ? { ...item, status } : item));
  write(updated);
  return updated;
}
