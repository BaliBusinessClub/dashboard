import { NextResponse } from "next/server";
import { consumeVerificationCode } from "@/lib/verification-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; code?: string };
  const email = body.email?.trim().toLowerCase();
  const code = body.code?.trim();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
  }

  const verified = consumeVerificationCode(email, code);

  if (!verified) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
