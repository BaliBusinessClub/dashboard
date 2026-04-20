import { NextResponse } from "next/server";
import { buildVerificationEmail } from "@/lib/auth-email-template";
import { storeVerificationCode } from "@/lib/verification-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; name?: string };
  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || "BBC Member";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  storeVerificationCode(email, code);

  const emailHtml = buildVerificationEmail({ code, name, email });

  return NextResponse.json({
    ok: true,
    previewMode: true,
    message: "Verification code generated. Connect a mail provider to send it live.",
    code,
    emailHtml
  });
}
