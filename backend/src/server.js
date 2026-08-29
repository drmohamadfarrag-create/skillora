async function sendEmail({ to, subject, html }) {
  console.log("EMAIL DEBUG START");
  console.log("EMAIL FROM:", process.env.EMAIL_FROM);
  console.log("RESEND KEY EXISTS:", Boolean(process.env.RESEND_API_KEY));
  console.log("SENDING TO:", to);

  if (!resend || !process.env.EMAIL_FROM) {
    console.error("EMAIL_PROVIDER_NOT_CONFIGURED");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log("RESEND RESULT:", JSON.stringify(result));

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return false;
    }

    console.log("EMAIL SENT SUCCESSFULLY");
    return true;
  } catch (error) {
    console.error("EMAIL SEND FAILED:", error.message || error);
    return false;
  }
}
