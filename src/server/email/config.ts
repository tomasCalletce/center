import { Resend } from "resend";
import { env } from "~/env";

export const resend = new Resend(env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: "Tomas from LetsACC <no-reply@letsacc.com>",
  replyTo: "hello@letsacc.com",
} as const; 