import { resend } from "@/lib/resend"

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  //for free plan we have to use onboarding@resend.dev as from address also we can send our self email through this address that we login in resend account
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html: body,
  })

  // The Resend SDK returns { data, error } and does not throw on API errors.
  // Throw so the run marks this step failed instead of looking successful.
  if (error || !data) {
    throw new Error(error?.message ?? "Resend returned no email id")
  }

  return { id: data.id }
}
