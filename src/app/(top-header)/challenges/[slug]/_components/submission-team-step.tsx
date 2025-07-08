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
  DropdownMenuSeparator,
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
import { Plus, X, Users, Clock, CheckCircle2, Edit2, Trash2, MoreVertical, Mail, Crown, UserCheck, ChevronDown } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

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
  const [teamName, setTeamName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [teamId, setTeamId] = useState<string | null>(initialData?.teamId || null);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const utils = api.useUtils();

  const userTeamsQuery = api.team.getUserTeams.useQuery({ challengeId });

  const teamDetailsQuery = api.team.getTeamDetails.useQuery(
    { teamId: teamId! },
    { 
      enabled: !!teamId,
      refetchInterval: 3000,
      refetchOnWindowFocus: true,
    }
  );

  useEffect(() => {
    if (teamDetailsQuery.data) {
      setNewTeamName(teamDetailsQuery.data.name);
    }
  }, [teamDetailsQuery.data]);

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      setTeamId(data.id);
      setTeamName("");
      toast.success("Team created successfully!");
      utils.team.getUserTeams.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendInvitationMutation = api.team.sendInvitation.useMutation({
    onSuccess: (result) => {
      if (result.success.length > 0) {
        toast.success(`Sent ${result.success.length} invitation(s) successfully!`);
      }
      if (result.errors.length > 0) {
        result.errors.forEach(error => toast.error(error));
      }
      setEmailList([]);
      setEmailInput("");
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

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emailList.includes(email)) {
      toast.error("Email already added");
      return;
    }

    setEmailList([...emailList, email]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter(email => email !== emailToRemove));
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSendInvitations = () => {
    if (!teamId || emailList.length === 0) return;

    sendInvitationMutation.mutate({
      teamId,
      inviteeEmails: emailList,
    });
  };

  const handleSelectExistingTeam = (team: any) => {
    setTeamId(team.id);
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
      teamName: currentTeam.name,
      memberCount: currentTeam.members.length,
    });
  };

  return (
    <div className="space-y-6">
      {userTeamsQuery.data && userTeamsQuery.data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Team</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {teamId && teamDetailsQuery.data ? teamDetailsQuery.data.name : "Select Team"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {userTeamsQuery.data.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => !team.hasSubmission && handleSelectExistingTeam(team)}
                  disabled={team.hasSubmission}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(team.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {team.id === teamId && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                    {team.hasSubmission && (
                      <Badge variant="secondary" className="text-xs">
                        Submitted
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTeamId(null)}
                className="text-gray-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {teamId && teamDetailsQuery.data && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-gray-600" />
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
                          setNewTeamName(teamDetailsQuery.data?.name || "");
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
                        setNewTeamName(teamDetailsQuery.data?.name || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <span>{teamDetailsQuery.data.name}</span>
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
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {teamDetailsQuery.data.members.length}/{teamDetailsQuery.data.max_members} Members
                </Badge>
                <Badge variant="outline">
                  {teamDetailsQuery.data.userRole}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamDetailsQuery.data.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {member.user.display_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{member.user.display_name}</div>
                      <div className="text-xs text-gray-500">{member.user.current_title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                      {member.role}
                    </Badge>
                    {teamDetailsQuery.data?.userRole === "ADMIN" && 
                     member.user._clerk !== teamDetailsQuery.data.members.find(m => m.role === "ADMIN")?.user._clerk && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-6 w-6 p-0">
                            <X className="h-3 w-3" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamDetailsQuery.data.pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {invitation.invitee.display_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{invitation.invitee.display_name}</div>
                          <div className="text-xs text-gray-500">
                            Invited {new Date(invitation.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!teamId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Team
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
      )}

      {teamId && teamDetailsQuery.data?.userRole === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invite Team Members
            </CardTitle>
            <CardDescription>
              Add email addresses to invite users to your team. You can have up to 5 members total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailInput">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="emailInput"
                  type="email"
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailInputKeyDown}
                />
                <Button
                  onClick={handleAddEmail}
                  disabled={!emailInput.trim()}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Press Enter or comma to add multiple emails
              </p>
            </div>

            {emailList.length > 0 && (
              <div className="space-y-2">
                <Label>Email Addresses to Invite ({emailList.length})</Label>
                <div className="space-y-2">
                  {emailList.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Mail className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{email}</div>
                          <div className="text-sm text-gray-500">Will receive invitation</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmail(email)}
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
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          {teamId ? "Team selected and ready" : "Create or select a team to continue"}
        </div>
        <Button
          onClick={handleNext}
          disabled={!teamId}
          size="lg"
        >
          Continue to Submission Details
        </Button>
      </div>
    </div>
  );
} 