const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export function storeVerificationCode(email: string, code: string) {
  verificationCodes.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
}

export function consumeVerificationCode(email: string, code: string) {
  const entry = verificationCodes.get(email);

  if (!entry) {
    return false;
  }

  if (entry.expiresAt < Date.now() || entry.code !== code) {
    return false;
  }

  verificationCodes.delete(email);
  return true;
}
