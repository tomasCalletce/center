import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { submissions } from "~/server/db/schemas/submissions";
import { challenges } from "~/server/db/schemas/challenges";
import { teams } from "~/server/db/schemas/teams";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { titleToSlug, isUUID } from "~/lib/utils";

export const allSubmissions = publicProcedure
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

    const allSubmissions = await db
      .select({
        id: submissions.id,
        _team: submissions._team,
        status: submissions.status,
        title: submissions.title,
        description: submissions.description,
        demo_url: submissions.demo_url,
        repository_url: submissions.repository_url,
        images: {
          pathname: assets.pathname,
          url: assets.url,
          alt: assetsImages.alt,
        },
        team: {
          id: teams.id,
          name: teams.name,
        },
        created_at: submissions.created_at,
        updated_at: submissions.updated_at,
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(assetsImages, eq(submissions._logo_image, assetsImages.id))
      .innerJoin(assets, eq(assetsImages._asset, assets.id))
      .where(eq(submissions._challenge, challengeId));

    return allSubmissions;
  });
