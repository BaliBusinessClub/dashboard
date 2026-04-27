import { NextResponse } from "next/server";
import { storeVerificationCode } from "@/lib/verification-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; name?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  const { expiresAt } = storeVerificationCode(email, code);
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json({
      ok: true,
      previewMode: true,
      message: "Verification code generated, but RESEND_API_KEY is still missing.",
      code,
      expiresAt
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Bali Business Club <no-reply@dashboard.balibusinessclub.com>",
      to: [email],
      subject: "Verify your email",
      template: {
        id: "f48bec9f-5e63-4a56-8307-c6aebf2b50bf",
        alias: "verification-email",
        variables: {
          code
        }
      }
    })
  });

  const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string };

  if (!response.ok) {
    return NextResponse.json(
      { error: result.message ?? result.error ?? "We could not send the verification email right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Verification code sent.",
    expiresAt
  });
}
