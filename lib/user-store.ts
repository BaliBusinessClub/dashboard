"use client";

export type StoredAccount = {
  email: string;
  name: string;
  role: "admin" | "member";
  password?: string;
  provider: "email" | "google";
  memberSince: string;
  ageRange?: string;
  memberType?: string;
  whatsapp?: string;
  picture?: string;
};

const ACCOUNT_KEY = "bbc-registered-accounts";

const seededAccounts: StoredAccount[] = [
  {
    email: "member@balibusinessclub.com",
    name: "BBC Member",
    role: "member",
    password: "BBCmember2026!",
    provider: "email",
    memberSince: "2026-01-03",
    ageRange: "25-34",
    memberType: "Investor",
    whatsapp: "+6281234567890"
  },
  {
    email: "admin@balibusinessclub.com",
    name: "BBC Admin",
    role: "admin",
    password: "BBCadmin2026!",
    provider: "email",
    memberSince: "2026-01-01"
  }
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function readCustomAccounts() {
  if (!canUseStorage()) {
    return [] as StoredAccount[];
  }

  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [] as StoredAccount[];
  }
}

function writeCustomAccounts(accounts: StoredAccount[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

export function getAllAccounts() {
  const merged = new Map<string, StoredAccount>();

  seededAccounts.forEach((account) => merged.set(account.email, account));
  readCustomAccounts().forEach((account) => merged.set(account.email, account));

  return Array.from(merged.values());
}

export function findAccountByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getAllAccounts().find((account) => account.email === normalizedEmail) ?? null;
}

export function authenticateAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = findAccountByEmail(normalizedEmail);

  if (!account || !account.password) {
    return null;
  }

  return account.password === password ? account : null;
}

export function saveAccount(account: StoredAccount) {
  const normalizedEmail = account.email.trim().toLowerCase();
  const existing = readCustomAccounts();
  const nextAccount = { ...account, email: normalizedEmail };
  const nextAccounts = existing.some((entry) => entry.email === normalizedEmail)
    ? existing.map((entry) => (entry.email === normalizedEmail ? nextAccount : entry))
    : [nextAccount, ...existing];

  writeCustomAccounts(nextAccounts);
  return nextAccount;
}
