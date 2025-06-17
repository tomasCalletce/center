import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { submissions } from "~/server/db/schemas/submissions";
import { challenges } from "~/server/db/schemas/challenges";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { clerkClient } from "~/server/api/auth";
import { titleToSlug, isUUID } from "~/lib/utils";

export const participant = publicProcedure
  .input(
    z.object({
      _challenge: z.string(),
    })
  )
  .query(async ({ input }) => {
    // Check if input is a UUID or a slug
    const inputIsUUID = isUUID(input._challenge);
    
    let challengeId: string;
    if (inputIsUUID) {
      challengeId = input._challenge;
    } else {
      // For slug, we need to get all challenges and find the one with matching slug
      const allChallenges = await db
        .select({
          id: challenges.id,
          title: challenges.title,
        })
        .from(challenges);
      
      const matchingChallenge = allChallenges.find(
        (challenge) => titleToSlug(challenge.title) === input._challenge
      );
      
      if (!matchingChallenge) {
        return []; // Return empty array if challenge not found
      }
      
      challengeId = matchingChallenge.id;
    }

    // Get submissions for this challenge and join with teams and team members
    const submissionParticipants = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        userId: teamMembers._user,
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .where(eq(submissions._challenge, challengeId))
      .limit(12); // Get more since we might have multiple team members per submission

    // Get unique user IDs
    const uniqueUserIds = Array.from(new Set(submissionParticipants.map((p) => p.userId)));

    if (uniqueUserIds.length === 0) {
      return [];
    }

    const userList = await clerkClient.users.getUserList({
      userId: uniqueUserIds,
    });

    return userList;
  });
