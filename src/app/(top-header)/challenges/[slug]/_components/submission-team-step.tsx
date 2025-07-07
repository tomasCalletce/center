"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Search, Plus, X, Users, Clock, CheckCircle2, XCircle, Edit2, Trash2, MoreVertical } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export type TeamData = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

interface SubmissionTeamStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  initialData?: TeamData;
}

export function SubmissionTeamStep({ challengeId, onNext, initialData }: SubmissionTeamStepProps) {
  const [teamName, setTeamName] = useState(initialData?.teamName || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [teamId, setTeamId] = useState<string | null>(initialData?.teamId || null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(!initialData);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState(teamName);

  useEffect(() => {
    setNewTeamName(teamName);
  }, [teamName]);

  const utils = api.useUtils();

  const userTeamsQuery = api.team.getUserTeams.useQuery(
    { challengeId },
    { enabled: !isCreatingTeam }
  );

  const searchUsersQuery = api.team.searchUsers.useQuery(
    { query: debouncedSearchQuery },
    { enabled: debouncedSearchQuery.length >= 2 }
  );

  const teamDetailsQuery = api.team.getTeamDetails.useQuery(
    { teamId: teamId! },
    { 
      enabled: !!teamId,
      refetchInterval: 3000,
      refetchOnWindowFocus: true,
    }
  );

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      setTeamId(data.id);
      setIsCreatingTeam(false);
      toast.success("Team created successfully!");
      utils.team.getUserTeams.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendInvitationMutation = api.team.sendInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent!");
      setSelectedUsers([]);
      setSearchQuery("");
      if (teamId) {
        utils.team.getTeamDetails.invalidate({ teamId });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeTeamMemberMutation = api.team.removeTeamMember.useMutation({
    onSuccess: () => {
      toast.success("Team member removed!");
      if (teamId) {
        utils.team.getTeamDetails.invalidate({ teamId });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateTeamMutation = api.team.updateTeam.useMutation({
    onSuccess: (data) => {
      toast.success("Team updated!");
      setTeamName(data.name);
      setNewTeamName(data.name);
      setEditingTeamName(false);
      if (teamId) {
        utils.team.getTeamDetails.invalidate({ teamId });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteTeamMutation = api.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast.success("Team deleted!");
      setTeamId(null);
      setTeamName("");
      setIsCreatingTeam(true);
      utils.team.getUserTeams.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    createTeamMutation.mutate({
      name: teamName,
      challengeId,
    });
  };

  const handleSelectUser = (userClerkId: string) => {
    if (!selectedUsers.includes(userClerkId)) {
      setSelectedUsers([...selectedUsers, userClerkId]);
    }
  };

  const handleRemoveUser = (userClerkId: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userClerkId));
  };

  const handleSendInvitations = () => {
    if (!teamId) return;

    selectedUsers.forEach(userClerkId => {
      sendInvitationMutation.mutate({
        teamId,
        inviteeClerkId: userClerkId,
      });
    });
  };

  const handleSelectExistingTeam = (team: any) => {
    setTeamId(team.id);
    setTeamName(team.name);
    setIsCreatingTeam(false);
  };

  const handleRemoveMember = (memberClerkId: string) => {
    if (!teamId) return;
    removeTeamMemberMutation.mutate({
      teamId,
      memberClerkId,
    });
  };

  const handleUpdateTeamName = () => {
    if (!teamId || !newTeamName.trim()) return;
    updateTeamMutation.mutate({
      teamId,
      name: newTeamName.trim(),
    });
  };

  const handleDeleteTeam = () => {
    if (!teamId) return;
    deleteTeamMutation.mutate({
      teamId,
    });
  };

  const handleNext = () => {
    if (!teamId) {
      toast.error("Please create or select a team first");
      return;
    }

    const currentTeam = teamDetailsQuery.data;
    if (!currentTeam) {
      toast.error("Unable to load team details");
      return;
    }



    onNext({
      teamId,
      teamName,
      memberCount: currentTeam.members.length,
    });
  };

  const availableUsers = searchUsersQuery.data?.filter(
    user => !selectedUsers.includes(user._clerk)
  ) || [];

  const selectedUserDetails = searchUsersQuery.data?.filter(
    user => selectedUsers.includes(user._clerk)
  ) || [];

  return (
    <div className="space-y-6">
      {isCreatingTeam ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Team
            </CardTitle>
            <CardDescription>
              Create a new team for this challenge. You'll be the team admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateTeam}
              disabled={!teamName.trim() || createTeamMutation.isPending}
              className="w-full"
            >
              {createTeamMutation.isPending ? "Creating..." : "Create Team"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {editingTeamName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="h-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateTeamName();
                        if (e.key === "Escape") {
                          setEditingTeamName(false);
                          setNewTeamName(teamName);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateTeamName}
                      disabled={updateTeamMutation.isPending || !newTeamName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTeamName(false);
                        setNewTeamName(teamName);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <span>Team: {teamName}</span>
                )}
              </div>
              {teamDetailsQuery.data?.userRole === "ADMIN" && !editingTeamName && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingTeamName(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Name
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Team
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Team</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this team? This action cannot be undone.
                            Teams with submissions cannot be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteTeam}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Team
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardTitle>
            <CardDescription>
              Your team for this challenge. You can submit alone or with up to 4 teammates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamDetailsQuery.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Members ({teamDetailsQuery.data.members.length}/{teamDetailsQuery.data.max_members})
                  </span>
                  <Badge variant="default">
                    Ready
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {teamDetailsQuery.data.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.user.display_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.user.display_name}</div>
                          <div className="text-sm text-gray-500">{member.user.current_title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                        {teamDetailsQuery.data?.userRole === "ADMIN" && 
                         member.user._clerk !== teamDetailsQuery.data.members.find(m => m.role === "ADMIN")?._clerk && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.user.display_name} from the team?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.user._clerk)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Member
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {teamDetailsQuery.data.pendingInvitations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Invitations
                    </div>
                    {teamDetailsQuery.data.pendingInvitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {invitation.invitee.display_name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invitation.invitee.display_name}</div>
                            <div className="text-sm text-gray-500">
                              Invited {new Date(invitation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {teamId && teamDetailsQuery.data?.userRole === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Invite Members
            </CardTitle>
            <CardDescription>
              Search for users to invite to your team. You can have up to 5 members total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userSearch">Search Users</Label>
              <Input
                id="userSearch"
                placeholder="Type to search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Users ({selectedUsers.length})</Label>
                <div className="space-y-2">
                  {selectedUserDetails.map((user) => (
                    <div key={user._clerk} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.display_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.display_name}</div>
                          <div className="text-sm text-gray-500">{user.current_title}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user._clerk)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSendInvitations}
                  disabled={sendInvitationMutation.isPending}
                  className="w-full"
                >
                  {sendInvitationMutation.isPending ? "Sending..." : "Send Invitations"}
                </Button>
              </div>
            )}

            {availableUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Search Results</Label>
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <div key={user._clerk} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.display_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.display_name}</div>
                          <div className="text-sm text-gray-500">{user.current_title}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectUser(user._clerk)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isCreatingTeam && userTeamsQuery.data && userTeamsQuery.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Existing Teams</CardTitle>
            <CardDescription>
              Or select an existing team for this challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {userTeamsQuery.data.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {team.hasSubmission && (
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Submitted
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectExistingTeam(team)}
                    disabled={team.hasSubmission}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!teamId}
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
} 