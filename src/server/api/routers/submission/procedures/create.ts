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
import { eq, and } from "drizzle-orm";
import { sendSubmissionReceivedEmail } from "~/server/email/services/submission";
import { z } from "zod";

const updateSubmissionSchema = verifySubmissionsSchema.extend({
  id: z.string().uuid(),
});

export const create = protectedProcedure
  .input(verifySubmissionsSchema)
  .mutation(async ({ input, ctx }) => {
    if (!input._team) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Team ID is required",
      });
    }

    const [userTeamMembership] = await dbSocket
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input._team),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      );

    if (!userTeamMembership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team",
      });
    }

    if (input._challenge) {
      const [existingSubmission] = await dbSocket
        .select()
        .from(submissions)
        .where(
          and(
            eq(submissions._challenge, input._challenge),
            eq(submissions._team, input._team)
          )
        )
        .limit(1);

      if (existingSubmission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This team has already submitted to this challenge",
        });
      }
    }

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

      const [newSubmission] = await tx
        .insert(submissions)
        .values({
          _team: input._team,
          _logo_image: newImage.id,
          _challenge: input._challenge,
          title: input.title,
          markdown: input.markdown,
          demo_url: input.demo_url,
          video_demo_url: (input as any).video_demo_url,
          repository_url: input.repository_url,
          status: input.status,
          submitted_by: ctx.auth.userId,
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
          videoDemoUrl: (input as any).video_demo_url,
          repositoryUrl: input.repository_url,
        });
      }
    }

    return result;
  });

export const update = protectedProcedure
  .input(updateSubmissionSchema)
  .mutation(async ({ input, ctx }) => {
    const [existingSubmission] = await dbSocket
      .select({
        submission: {
          id: submissions.id,
          _team: submissions._team,
          _logo_image: submissions._logo_image,
        },
        team: {
          id: teams.id,
        },
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .where(
        and(
          eq(submissions.id, input.id),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      )
      .limit(1);

    if (!existingSubmission) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Submission not found or you don't have permission to edit it",
      });
    }

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

      const [updatedSubmission] = await tx
        .update(submissions)
        .set({
          title: input.title,
          markdown: input.markdown,
          demo_url: input.demo_url,
          video_demo_url: (input as any).video_demo_url,
          repository_url: input.repository_url,
          status: input.status,
          _logo_image: newImage.id,
          updated_at: new Date(),
        })
        .where(eq(submissions.id, input.id))
        .returning({ id: submissions.id });

      if (!updatedSubmission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update submission in database.",
        });
      }

      return updatedSubmission;
    });

    return result;
  });
