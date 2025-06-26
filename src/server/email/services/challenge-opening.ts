import { render } from "@react-email/render";
import { resend, EMAIL_CONFIG } from "../config";
import { ChallengeOpeningNotification } from "../templates/challenge-opening-notification";
import { clerkClient } from "~/server/api/auth";
import { db } from "~/server/db/connection";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { challenges } from "~/server/db/schemas/challenges";
import { users } from "~/server/db/schemas/users";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";

interface SendChallengeOpeningNotificationsParams {
  challengeId: string;
}

export async function sendChallengeOpeningNotifications({
  challengeId,
}: SendChallengeOpeningNotificationsParams) {
  try {
    const challenge = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1);

    if (!challenge[0]) {
      throw new Error("Challenge not found");
    }

    const challengeData = challenge[0];

    const interestedUsers = await db
      .select({
        clerkId: users._clerk,
        displayName: users.display_name,
      })
      .from(participationIntents)
      .innerJoin(users, eq(participationIntents._clerk, users._clerk))
      .where(eq(participationIntents._challenge, challengeId));

    if (interestedUsers.length === 0) {
      return { success: true, message: "No users to notify" };
    }

    const client = await clerkClient;
    const notifications = [];

    for (const user of interestedUsers) {
      try {
        const clerkUser = await client.users.getUser(user.clerkId);
        const userEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;

        if (!userEmail) continue;

        const userDisplayName = user.displayName || clerkUser.fullName || clerkUser.firstName || "there";
        
        const prizePool = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: challengeData.price_pool_currency,
          maximumFractionDigits: 0,
        }).format(challengeData.price_pool);

        const deadline = format(challengeData.deadline_at, "MMM dd, yyyy 'at' h:mm a");

        const emailHtml = await render(
          ChallengeOpeningNotification({
            userDisplayName,
            challengeTitle: challengeData.title,
            challengeSlug: challengeData.slug,
            prizePool,
            deadline,
          })
        );

        const { data, error } = await resend.emails.send({
          from: EMAIL_CONFIG.from,
          to: [userEmail],
          subject: `${challengeData.title} is now open for submissions!`,
          html: emailHtml,
          replyTo: EMAIL_CONFIG.replyTo,
        });

        if (error) {
          console.error(`Failed to send email to ${userEmail}:`, error);
        } else {
          notifications.push({ email: userEmail, success: true });
        }
      } catch (error) {
        console.error(`Error processing user ${user.clerkId}:`, error);
      }
    }

    return { 
      success: true, 
      message: `Sent ${notifications.length} notifications out of ${interestedUsers.length} users` 
    };
  } catch (error) {
    console.error("Error sending challenge opening notifications:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
} 