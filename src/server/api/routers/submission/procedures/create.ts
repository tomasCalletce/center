import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { submissions } from "~/server/db/schemas/submissions";
import { TRPCError } from "@trpc/server";
import { dbSocket } from "~/server/db/connection";
import { verifySubmissionsSchema } from "~/server/db/schemas/submissions";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { challenges } from "~/server/db/schemas/challenges";
import { eq } from "drizzle-orm";
import { sendSubmissionReceivedEmail } from "~/server/email/services/submission";

export const create = protectedProcedure
  .input(verifySubmissionsSchema)
  .mutation(async ({ input, ctx }) => {
    const result = await dbSocket.transaction(async (tx) => {
      const [newAsset] = await tx
        .insert(assets)
        .values({
          _clerk: ctx.auth.userId,
          pathname: input.verifyAssetsImageSchema.verifyAssetsSchema.pathname,
          url: input.verifyAssetsImageSchema.verifyAssetsSchema.url,
        })
        .returning({ id: assets.id });
      if (!newAsset) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create asset in database.",
        });
      }

      const [newImage] = await tx
        .insert(assetsImages)
        .values({
          _clerk: ctx.auth.userId,
          _asset: newAsset.id,
          alt: input.verifyAssetsImageSchema.alt,
        })
        .returning({ id: assetsImages.id });
      if (!newImage) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create image in database.",
        });
      }

      const [newTeam] = await tx
        .insert(teams)
        .values({
          _clerk: ctx.auth.userId,
          name: "Team",
        })
        .returning({ id: teams.id });
      if (!newTeam) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create team in database.",
        });
      }

      const [newTeamMember] = await tx
        .insert(teamMembers)
        .values({
          _team: newTeam.id,
          _clerk: ctx.auth.userId,
          role: "ADMIN",
        })
        .returning({ id: teamMembers.id });
      if (!newTeamMember) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create team member in database.",
        });
      }

      const [newSubmission] = await tx
        .insert(submissions)
        .values({
          _team: newTeam.id,
          _logo_image: newImage.id,
          _challenge: input._challenge,
          title: input.title,
          markdown: input.markdown,
          demo_url: input.demo_url,
          repository_url: input.repository_url,
          status: input.status,
        })
        .returning({ id: submissions.id });
      if (!newSubmission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission in database.",
        });
      }

      return newSubmission;
    });

    if (input._challenge) {
      const [challenge] = await dbSocket
        .select({
          title: challenges.title,
          slug: challenges.slug,
        })
        .from(challenges)
        .where(eq(challenges.id, input._challenge));

      if (challenge) {
        await sendSubmissionReceivedEmail({
          userClerkId: ctx.auth.userId,
          submissionTitle: input.title,
          challengeTitle: challenge.title,
          challengeSlug: challenge.slug,
          demoUrl: input.demo_url,
          repositoryUrl: input.repository_url,
        });
      }
    }

    return result;
  });
