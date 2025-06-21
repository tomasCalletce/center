import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MapPin, Linkedin, Github, Globe, Folder } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileHeaderProps {
  user: {
    display_name?: string | null;
    location?: string | null;
    current_title?: string | null;
    social_links?: SocialLink[] | null;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    linkedin: Linkedin,
    github: Github,
    website: Globe,
    portfolio: Folder
  };

  return (
    <Card className="mb-8 border-dashed">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-4">
            <div className="inline-flex items-center">
              <div className="h-1 w-8 bg-slate-900 rounded-full" />
              <span className="ml-3 text-sm uppercase tracking-wider font-medium">
                Profile
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {user.display_name || "Unknown User"}
            </h1>
            <div className="flex flex-wrap gap-3 text-muted-foreground">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {user.location}
                </span>
              )}
              {user.current_title && (
                <Badge variant="secondary" className="border-dashed">{user.current_title}</Badge>
              )}
            </div>
          </div>
          
          {user.social_links && user.social_links.length > 0 && (
            <div className="flex gap-2">
              {user.social_links.map((link, index) => {
                const IconComponent = socialIcons[link.platform];
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-dashed"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {IconComponent ? <IconComponent className="h-4 w-4 mr-1" /> : <Globe className="h-4 w-4 mr-1" />}
                      {link.platform}
                    </a>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 