import { Button } from "~/components/ui/button";
import { MapPin, Linkedin, Github, Globe, Folder } from "lucide-react";
import { type User } from "~/server/db/schemas/users";

export const socialIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  portfolio: Folder,
};

interface ProfileHeaderViewProps {
  user: User;
}

export const ProfileHeaderView = ({ user }: ProfileHeaderViewProps) => {
  return (
    <div className="space-y-4">
      {/* Name and title */}
      <div className="space-y-1">
        <h1 className="text-xl font-medium text-slate-900">
          {user.display_name}
        </h1>
        {user.current_title && (
          <p className="text-sm text-muted-foreground">{user.current_title}</p>
        )}
      </div>

      {/* Location and experience info */}
      {user.location && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      )}
      {user.social_links && user.social_links.length > 0 && (
        <div className="flex gap-2">
          {user.social_links.map((link, index) => {
            const IconComponent = socialIcons[link.platform];
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-dashed hover:bg-slate-50 transition-colors"
                asChild
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.platform}
                >
                  {IconComponent ? (
                    <IconComponent className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Globe className="h-4 w-4 text-slate-600" />
                  )}
                </a>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
