"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authenticateAccount, findAccountByEmail, saveAccount, StoredAccount } from "@/lib/user-store";

type UserRole = "admin" | "member";
const ADMIN_EMAIL = "admin@balibusinessclub.com";

export type SessionUser = {
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
  companyLogo?: string;
  memberSince: string;
  ageRange?: string;
  memberType?: string;
  whatsapp?: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  signInWithEmail: (email: string, name?: string, profile?: Partial<SessionUser>) => SessionUser;
  signInWithPassword: (email: string, password: string) => SessionUser | null;
  registerMember: (account: {
    email: string;
    name: string;
    password?: string;
    ageRange?: string;
    memberType?: string;
    whatsapp?: string;
    picture?: string;
    provider?: "email" | "google";
  }) => SessionUser;
  signInWithGoogleProfile: (profile: {
    email: string;
    name: string;
    picture?: string;
    ageRange?: string;
    memberType?: string;
    whatsapp?: string;
  }) => { user: SessionUser; created: boolean };
  signOut: () => void;
  updateProfile: (updates: Partial<SessionUser>) => void;
};

const STORAGE_KEY = "bbc-session-user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<SessionUser>;
        const nextUser: SessionUser = {
          email: parsed.email ?? "",
          name: parsed.name ?? "",
          role: parsed.role === "admin" ? "admin" : "member",
          picture: parsed.picture ?? "",
          companyLogo: parsed.companyLogo ?? "",
          memberSince: parsed.memberSince ?? new Date().toISOString().slice(0, 10),
          ageRange: parsed.ageRange ?? "",
          memberType: parsed.memberType ?? "",
          whatsapp: parsed.whatsapp ?? ""
        };
        setUser(nextUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  function persist(nextUser: SessionUser | null) {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function toSessionUser(account: Partial<StoredAccount> & { email: string; role?: UserRole; name?: string }) {
    const normalizedEmail = account.email.trim().toLowerCase();
    return {
      email: normalizedEmail,
      name: account.name?.trim() || normalizedEmail.split("@")[0].replace(/[._-]/g, " ").toUpperCase(),
      role: account.role === "admin" || normalizedEmail === ADMIN_EMAIL ? "admin" : "member",
      picture: account.picture ?? "",
      companyLogo: "",
      memberSince: account.memberSince ?? new Date().toISOString().slice(0, 10),
      ageRange: account.ageRange ?? "",
      memberType: account.memberType ?? "",
      whatsapp: account.whatsapp ?? ""
    } satisfies SessionUser;
  }

  function signInWithEmail(email: string, name?: string, profile?: Partial<SessionUser>) {
    const normalizedEmail = email.trim().toLowerCase();
    const sessionUser = toSessionUser({
      email: normalizedEmail,
      name: name?.trim(),
      role: normalizedEmail === ADMIN_EMAIL ? "admin" : "member",
      picture: profile?.picture,
      memberSince: profile?.memberSince,
      ageRange: profile?.ageRange,
      memberType: profile?.memberType,
      whatsapp: profile?.whatsapp
    });
    persist(sessionUser);
    return sessionUser;
  }

  function signInWithPassword(email: string, password: string) {
    const account = authenticateAccount(email, password);

    if (!account) {
      return null;
    }

    const sessionUser = toSessionUser(account);
    persist(sessionUser);
    return sessionUser;
  }

  function registerMember(account: {
    email: string;
    name: string;
    password?: string;
    ageRange?: string;
    memberType?: string;
    whatsapp?: string;
    picture?: string;
    provider?: "email" | "google";
  }) {
    const stored = saveAccount({
      email: account.email,
      name: account.name,
      password: account.password,
      role: account.email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "member",
      provider: account.provider ?? "email",
      memberSince: new Date().toISOString().slice(0, 10),
      ageRange: account.ageRange ?? "",
      memberType: account.memberType ?? "",
      whatsapp: account.whatsapp ?? "",
      picture: account.picture ?? ""
    });

    const sessionUser = toSessionUser(stored);
    persist(sessionUser);
    return sessionUser;
  }

  function signInWithGoogleProfile(profile: {
    email: string;
    name: string;
    picture?: string;
    ageRange?: string;
    memberType?: string;
    whatsapp?: string;
  }) {
    const normalizedEmail = profile.email.trim().toLowerCase();
    const existing = findAccountByEmail(normalizedEmail);

    if (existing) {
      const updated = saveAccount({
        ...existing,
        picture: profile.picture || existing.picture,
        name: profile.name || existing.name
      });
      const sessionUser = toSessionUser(updated);
      persist(sessionUser);
      return { user: sessionUser, created: false };
    }

    const sessionUser = registerMember({
      email: normalizedEmail,
      name: profile.name,
      ageRange: profile.ageRange,
      memberType: profile.memberType,
      whatsapp: profile.whatsapp,
      picture: profile.picture,
      provider: "google"
    });

    return { user: sessionUser, created: true };
  }

  function signOut() {
    persist(null);
  }

  function updateProfile(updates: Partial<SessionUser>) {
    if (!user) {
      return;
    }

    const nextUser = { ...user, ...updates };
    persist(nextUser);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signInWithEmail,
      signInWithPassword,
      registerMember,
      signInWithGoogleProfile,
      signOut,
      updateProfile
    }),
    [ready, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
