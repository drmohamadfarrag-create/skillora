const RESEND_API_URL = 'https://api.resend.com/emails';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function frontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'SKILLORA <noreply@skillora.dev>';

  if (!apiKey) {
    // Dev-mode fallback: no provider configured, so just log it instead of
    // silently failing. Never used in production (RESEND_API_KEY is required
    // there — see docs/DEPLOYMENT.md).
    console.log(`[email:dev-mode] To: ${to}\nSubject: ${subject}\n${html}\n`);
    return { devMode: true };
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[email] Resend send failed', res.status, body);
    throw new Error('EMAIL_SEND_FAILED');
  }

  return res.json();
}

export async function sendVerificationEmail(user, token) {
  const link = `${frontendUrl()}/?verify=${encodeURIComponent(token)}`;
  const isAr = user.language === 'ar';
  const subject = isAr ? 'تفعيل حسابك في سكيلورا' : 'Verify your SKILLORA account';
  const html = isAr
    ? `<p>مرحبًا ${escapeHtml(user.name)}،</p><p>فعّل بريدك الإلكتروني لبدء التعلم:</p><p><a href="${link}">${link}</a></p><p>ينتهي هذا الرابط خلال 24 ساعة.</p>`
    : `<p>Hi ${escapeHtml(user.name)},</p><p>Confirm your email to start learning:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`;
  await sendEmail({ to: user.email, subject, html });
}

export async function sendPasswordResetEmail(user, token) {
  const link = `${frontendUrl()}/?reset=${encodeURIComponent(token)}`;
  const isAr = user.language === 'ar';
  const subject = isAr ? 'إعادة تعيين كلمة المرور' : 'Reset your SKILLORA password';
  const html = isAr
    ? `<p>مرحبًا ${escapeHtml(user.name)}،</p><p>لإعادة تعيين كلمة المرور، افتح الرابط التالي. إن لم تطلب ذلك يمكنك تجاهل هذه الرسالة.</p><p><a href="${link}">${link}</a></p><p>ينتهي هذا الرابط خلال ساعة واحدة.</p>`
    : `<p>Hi ${escapeHtml(user.name)},</p><p>Reset your password using the link below. If you didn't request this, you can safely ignore this email.</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`;
  await sendEmail({ to: user.email, subject, html });
}
