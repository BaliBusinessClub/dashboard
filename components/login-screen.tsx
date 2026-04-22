"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type Mode = "signin" | "create" | "verify";
const ADMIN_EMAIL = "admin@balibusinessclub.com";

const memberTypeOptions = [
  "Business owner",
  "Investor",
  "Developer",
  "Operator",
  "Broker",
  "Consultant",
  "Creator",
  "Other"
] as const;

export function LoginScreen() {
  const router = useRouter();
  const { user, ready, signInWithEmail } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("Made Prasetya");
  const [email, setEmail] = useState("member@balibusinessclub.com");
  const [code, setCode] = useState("");
  const [ageRange, setAgeRange] = useState("25-34");
  const [memberType, setMemberType] = useState("Business owner");
  const [memberTypeOther, setMemberTypeOther] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [pendingFlow, setPendingFlow] = useState<"signin" | "create">("signin");
  const companyLogoInputRef = useRef<HTMLInputElement | null>(null);

  const isAdminAttempt = useMemo(() => email.trim().toLowerCase() === ADMIN_EMAIL, [email]);
  const effectiveMemberType = memberType === "Other" ? memberTypeOther.trim() : memberType;

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    router.replace(user.role === "admin" ? "/admin" : "/dashboard");
  }, [ready, router, user]);

  async function sendCode(flow: "signin" | "create") {
    if (flow === "create") {
      if (!name.trim()) {
        setStatus("Please add your name before creating an account.");
        return;
      }
      if (!password || !confirmPassword) {
        setStatus("Please enter and confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setStatus("Your passwords do not match yet.");
        return;
      }
      if (!effectiveMemberType) {
        setStatus("Please choose what best describes you.");
        return;
      }
    }

    setStatus(flow === "create" ? "Sending account confirmation email..." : "Sending sign-in code...");
    setPreviewCode(null);

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, flow })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Unable to generate the access code.");
      return;
    }

    setPendingFlow(flow);
    setMode("verify");
    setPreviewCode(result.code ?? null);
    setStatus(flow === "create" ? "Account confirmation code sent." : isAdminAttempt ? "Admin code ready." : "Sign-in code sent.");
  }

  async function verifyCode() {
    setStatus("Checking your code...");

    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const result = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Verification failed.");
      return;
    }

    const sessionUser = signInWithEmail(email, name, {
      ageRange,
      memberType: effectiveMemberType,
      companyLogo
    });

    router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
  }

  function continueWithGoogle() {
    setStatus("Google sign-in still needs the real Google OAuth client credentials before it can work live.");
  }

  if (!ready) {
    return <main className="auth-screen simple" />;
  }

  return (
    <main className="auth-screen simple">
      <section className="auth-center auth-center-minimal">
        <div className="auth-logo-wrap compact lifted">
          <Image
            src="/bali-business-club-logo-white.png"
            alt="Bali Business Club"
            width={286}
            height={94}
            className="login-logo-image"
          />
        </div>

        <div className="auth-switch compact">
          <button
            type="button"
            className={mode === "signin" || (mode === "verify" && pendingFlow === "signin") ? "active" : ""}
            onClick={() => {
              setMode("signin");
              setPendingFlow("signin");
              setStatus(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "create" || (mode === "verify" && pendingFlow === "create") ? "active" : ""}
            onClick={() => {
              setMode("create");
              setPendingFlow("create");
              setStatus(null);
            }}
          >
            Create account
          </button>
        </div>

        <div className="auth-card clean minimal-login-card">
          {mode === "create" ? (
            <>
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                Age range
                <select value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>
              </label>
              <label>
                What best describes you?
                <select value={memberType} onChange={(event) => setMemberType(event.target.value)}>
                  {memberTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              {memberType === "Other" ? (
                <label>
                  Tell us more
                  <input value={memberTypeOther} onChange={(event) => setMemberTypeOther(event.target.value)} placeholder="Write your role" />
                </label>
              ) : null}
              <label>
                Company logo
                <button type="button" className="ghost-button compact lefted" onClick={() => companyLogoInputRef.current?.click()}>
                  Upload logo
                </button>
                {companyLogo ? <span className="upload-note">Logo added to your profile.</span> : <span className="upload-note">Optional, but useful for member profiles.</span>}
                <input
                  ref={companyLogoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden-file-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setCompanyLogo(String(reader.result ?? ""));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </label>
            </>
          ) : null}

          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          {mode === "signin" ? (
            <label>
              Code
              <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter your sign-in code" />
            </label>
          ) : null}

          {mode === "verify" ? (
            <label>
              Confirmation code
              <input value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
          ) : null}

          {mode === "verify" ? (
            <div className="minimal-login-actions">
              <button type="button" className="primary-button compact" onClick={verifyCode}>
                <LockKeyhole size={14} />
                Continue
              </button>
              <button
                type="button"
                className="ghost-button compact"
                onClick={() => setMode(pendingFlow === "create" ? "create" : "signin")}
              >
                Back
              </button>
            </div>
          ) : (
            <div className="minimal-login-actions">
              {mode === "signin" ? (
                <>
                  <button type="button" className="primary-button compact" onClick={() => sendCode("signin")}>
                    <Mail size={14} />
                    {isAdminAttempt ? "Send access code" : "Send sign-in code"}
                  </button>
                  <button type="button" className="ghost-button compact" onClick={verifyCode}>
                    <LockKeyhole size={14} />
                    Sign in with code
                  </button>
                </>
              ) : (
                <button type="button" className="primary-button compact" onClick={() => sendCode("create")}>
                  <Mail size={14} />
                  Confirm account email
                </button>
              )}
              <button type="button" className="google-button compact-google" onClick={continueWithGoogle}>
                Continue with Google
              </button>
            </div>
          )}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">Preview code: {previewCode}</p> : null}
        </div>
      </section>
    </main>
  );
}
