const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export function storeVerificationCode(email: string, code: string) {
  const entry = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  };
  verificationCodes.set(email, entry);
  return entry;
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

export function getVerificationCode(email: string) {
  return verificationCodes.get(email) ?? null;
}

export function clearVerificationCode(email: string) {
  verificationCodes.delete(email);
}
