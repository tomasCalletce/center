import { render } from "@react-email/render";
import { resend, EMAIL_CONFIG } from "../config";
import { SubmissionReceivedEmail } from "../templates/submission-received";
import { clerkClient } from "~/server/api/auth";

interface SendSubmissionReceivedEmailParams {
  userClerkId: string;
  submissionTitle: string;
  challengeTitle: string;
  challengeSlug: string;
  demoUrl: string;
  repositoryUrl: string;
}

export async function sendSubmissionReceivedEmail({
  userClerkId,
  submissionTitle,
  challengeTitle,
  challengeSlug,
  demoUrl,
  repositoryUrl,
}: SendSubmissionReceivedEmailParams) {
  try {
    const client = await clerkClient;
    const user = await client.users.getUser(userClerkId);
    
    const userEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
    const userDisplayName = user.fullName || user.firstName || "there";

    if (!userEmail) {
      throw new Error("User email not found");
    }

    const emailHtml = await render(
      SubmissionReceivedEmail({
        userDisplayName,
        submissionTitle,
        challengeTitle,
        challengeSlug,
        demoUrl,
        repositoryUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [userEmail],
      subject: `Submission received for ${challengeTitle}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending submission received email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
} 