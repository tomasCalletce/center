import { createTRPCRouter } from "~/server/api/trpc";
import { createTeam } from "~/server/api/routers/team/procedures/create-team";
import { sendInvitation } from "~/server/api/routers/team/procedures/send-invitation";
import { getInvitations } from "~/server/api/routers/team/procedures/get-invitations";
import { respondToInvitation } from "~/server/api/routers/team/procedures/respond-to-invitation";
import { getTeamDetails } from "~/server/api/routers/team/procedures/get-team-details";
import { getUserTeams } from "~/server/api/routers/team/procedures/get-user-teams";
import { removeTeamMember } from "~/server/api/routers/team/procedures/remove-team-member";
import { updateTeam } from "~/server/api/routers/team/procedures/update-team";
import { deleteTeam } from "~/server/api/routers/team/procedures/delete-team";

export const teamRouter = createTRPCRouter({
  createTeam,
  sendInvitation,
  getInvitations,
  respondToInvitation,
  getTeamDetails,
  getUserTeams,
  removeTeamMember,
  updateTeam,
  deleteTeam,
}); 