"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
};

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  signInWithEmail: (
    email: string,
    name?: string,
    profile?: Pick<SessionUser, "ageRange" | "memberType" | "companyLogo">
  ) => SessionUser;
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
          memberType: parsed.memberType ?? ""
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

  function signInWithEmail(
    email: string,
    name?: string,
    profile?: Pick<SessionUser, "ageRange" | "memberType" | "companyLogo">
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const sessionUser: SessionUser = {
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split("@")[0].replace(/[._-]/g, " ").toUpperCase(),
      role: normalizedEmail === ADMIN_EMAIL ? "admin" : "member",
      picture: "",
      companyLogo: profile?.companyLogo ?? "",
      memberSince: new Date().toISOString().slice(0, 10),
      ageRange: profile?.ageRange ?? "",
      memberType: profile?.memberType ?? ""
    };
    persist(sessionUser);
    return sessionUser;
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
