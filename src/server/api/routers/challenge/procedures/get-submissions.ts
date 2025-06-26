import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { submissions } from "~/server/db/schemas/submissions";
import { teamMembers } from "~/server/db/schemas/team-members";
import { and, eq, inArray } from "drizzle-orm";
import { teams } from "~/server/db/schemas/teams";
import { users } from "~/server/db/schemas/users";
import { challenges } from "~/server/db/schemas/challenges";

export const getSubmissions = protectedProcedure
  .input(
    z
      .object({
        _challenge: z.string().uuid().optional(),
        challenge_slug: z.string().optional(),
      })
      .refine((data) => data._challenge || data.challenge_slug, {
        message: "Either challenge ID or slug must be provided",
      })
  )
  .query(async ({ input, ctx }) => {
    const whereCondition = input._challenge
      ? eq(challenges.id, input._challenge)
      : eq(challenges.slug, input.challenge_slug!);

    // First get the challenge to ensure it exists and get its ID
    const challenge = await db
      .select({
        id: challenges.id,
      })
      .from(challenges)
      .where(whereCondition)
      .limit(1);

    if (challenge.length === 0) {
      return [];
    }

    const challengeId = challenge[0]!.id;

    const userTeams = await db
      .select({
        teamId: teamMembers._team,
      })
      .from(teamMembers)
      .where(eq(teamMembers._clerk, ctx.auth.userId));

    if (userTeams.length === 0) {
      return [];
    }

    const teamIds = userTeams.map((team) => team.teamId);

    const challengeSubmissions = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        demo_url: submissions.demo_url,
        repository_url: submissions.repository_url,
        team: {
          id: teams.id,
          name: teams.name,
        },
        submitted_by: {
          _clerk: users._clerk,
          display_name: users.display_name,
        },
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(users, eq(submissions.submitted_by, users._clerk))
      .where(
        and(
          eq(submissions._challenge, challengeId),
          inArray(submissions._team, teamIds)
        )
      );

    return challengeSubmissions;
  });
