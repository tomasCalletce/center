import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { teams } from "~/server/db/schemas/teams";
import { users } from "~/server/db/schemas/users";
import { eq, and } from "drizzle-orm";
import { teamInvitationStatusValues } from "~/server/db/schemas/team-invitations";

export const getInvitations = protectedProcedure.query(async ({ ctx }) => {
  const invitations = await dbSocket
    .select({
      id: teamInvitations.id,
      message: teamInvitations.message,
      status: teamInvitations.status,
      expires_at: teamInvitations.expires_at,
      created_at: teamInvitations.created_at,
      team: {
        id: teams.id,
        name: teams.name,
      },
      inviter: {
        _clerk: users._clerk,
        display_name: users.display_name,
      },
    })
    .from(teamInvitations)
    .innerJoin(teams, eq(teamInvitations._team, teams.id))
    .innerJoin(users, eq(teamInvitations._inviter, users._clerk))
    .where(
      and(
        eq(teamInvitations._invitee, ctx.auth.userId),
        eq(teamInvitations.status, teamInvitationStatusValues.PENDING)
      )
    );

  return invitations;
});
