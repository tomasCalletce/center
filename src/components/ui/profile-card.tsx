import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { type User } from "@clerk/nextjs/server";

interface ProfileCardProps extends React.ComponentProps<"div"> {
  user: User;
  showBadge?: boolean;
  badgeText?: string;
  size?: "sm" | "md" | "lg";
}

export function ProfileCard({
  user,
  showBadge = false,
  badgeText,
  size = "md",
  className,
  ...props
}: ProfileCardProps) {
  const avatarSize = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 min-w-fit cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className={cn(avatarSize, "ring-2 ring-background shadow-sm")}>
          <AvatarImage
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="object-cover"
          />
          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/20 to-primary/10">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        {showBadge && (
          <div className="absolute -top-1 -right-1 p-1 bg-amber-100 rounded-full">
            <div className="h-3 w-3 bg-amber-600 rounded-full" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate text-sm">
            {user.fullName || "Unknown User"}
          </h3>
          {badgeText && (
            <Badge variant="outline" className="text-xs">
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {user.username ||
            user.emailAddresses[0]?.emailAddress ||
            "No username"}
        </p>
      </div>
    </div>
  );
}
