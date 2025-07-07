import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { users } from "~/server/db/schemas/users";
import { ilike } from "drizzle-orm";

export const searchUsers = publicProcedure
  .input(
    z.object({
      query: z.string().min(2).max(50),
      limit: z.number().min(1).max(20).default(10),
    })
  )
  .query(async ({ input }) => {
    const searchResults = await dbSocket
      .select({
        _clerk: users._clerk,
        display_name: users.display_name,
        current_title: users.current_title,
        location: users.location,
      })
      .from(users)
      .where(ilike(users.display_name, `%${input.query}%`))
      .limit(input.limit);

    return searchResults;
  }); 