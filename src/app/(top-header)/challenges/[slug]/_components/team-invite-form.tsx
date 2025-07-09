"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { X, Plus, Mail } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface TeamInviteFormProps {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TeamInviteForm({ teamId, onSuccess, onCancel }: TeamInviteFormProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [message, setMessage] = useState("");

  const utils = api.useUtils();

  const sendInvitationMutation = api.team.sendInvitation.useMutation({
    onSuccess: (result) => {
      if (result.success.length > 0) {
        toast.success(`Sent ${result.success.length} invitation(s)`);
      }
      if (result.errors.length > 0) {
        result.errors.forEach((error) => toast.error(error));
      }
      
      setEmails([]);
      setCurrentEmail("");
      setMessage("");
      utils.team.getTeamDetails.invalidate({ teamId });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addEmail = () => {
    const email = currentEmail.trim();
    if (email && !emails.includes(email)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setEmails([...emails, email]);
        setCurrentEmail("");
      } else {
        toast.error("Please enter a valid email address");
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = () => {
    if (emails.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    sendInvitationMutation.mutate({
      teamId,
      inviteeEmails: emails,
      message: message.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Addresses
        </Label>
        <div className="flex gap-2">
          <Input
            id="email"
            placeholder="Enter email address"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendInvitationMutation.isPending}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmail}
            disabled={!currentEmail.trim() || sendInvitationMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Invitations to send</Label>
          <div className="flex flex-wrap gap-2">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1">
                <Mail className="h-3 w-3" />
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="ml-1 hover:text-destructive"
                  disabled={sendInvitationMutation.isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message (optional)
        </Label>
        <Textarea
          id="message"
          placeholder="Add a personal message to the invitation..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sendInvitationMutation.isPending}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={sendInvitationMutation.isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={emails.length === 0 || sendInvitationMutation.isPending}
          isLoading={sendInvitationMutation.isPending}
        >
          Send Invitation{emails.length > 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
} 