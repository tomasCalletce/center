"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Edit, Eye } from "lucide-react";

interface ProfileEditManagerProps {
  children: React.ReactNode;
}

export const ProfileEditManager = ({ children }: ProfileEditManagerProps) => {
  const [isGlobalEdit, setIsGlobalEdit] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button
          variant={isGlobalEdit ? "default" : "outline"}
          onClick={() => setIsGlobalEdit(!isGlobalEdit)}
          className="flex items-center gap-2"
        >
          {isGlobalEdit ? (
            <>
              <Eye className="h-4 w-4" />
              View Mode
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Mode
            </>
          )}
        </Button>
      </div>
      
      <div className="profile-edit-context" data-edit-mode={isGlobalEdit}>
        {children}
      </div>
    </div>
  );
}; 