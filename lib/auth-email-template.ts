export function buildVerificationEmail({
  code,
  name,
  email
}: {
  code: string;
  name: string;
  email: string;
}) {
  return `
    <div style="background:#000000;padding:40px 20px;font-family:Arial,sans-serif;color:#ffffff;">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,216,0,0.35);background:#071122;border-radius:24px;overflow:hidden;">
        <div style="padding:32px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:12px;letter-spacing:0.3em;color:#096cfe;">BALI BUSINESS CLUB</div>
          <h1 style="margin:16px 0 0;font-size:36px;line-height:1.1;color:#ffd800;text-transform:uppercase;">Verify Your Email</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hello ${name},</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
            Use the code below to confirm <strong>${email}</strong> and activate your BBC dashboard access.
          </p>
          <div style="padding:18px 24px;border-radius:18px;background:#06429a;display:inline-block;font-size:32px;font-weight:700;letter-spacing:0.3em;color:#ffd800;">
            ${code}
          </div>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#cbd5f5;">
            This code expires in 10 minutes. If you did not request access, you can safely ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;
}
