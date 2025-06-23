import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MapPin, Calendar, Globe } from "lucide-react";
import {
  calculateYearsOfExperience,
  socialIcons,
} from "~/app/(top-header)/profile/_components/utils";
import { type UserProfile } from "~/app/(top-header)/profile/_components/types/profile-types";

type Experience = NonNullable<UserProfile["experience"]>[number];
type ProfileHeaderData = Omit<UserProfile, 'experience' | 'education' | 'skills'>;

interface ProfileHeaderViewProps {
  data: ProfileHeaderData;
  experience?: Experience[] | null;
}

export const ProfileHeaderView = ({ data, experience }: ProfileHeaderViewProps) => {
  const yearsOfExperience = calculateYearsOfExperience(experience);

  return (
    <div className="space-y-6 py-4">
      {/* Name with refined gradient */}
      <div className="space-y-2">
        {/* <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
          {data.display_name || "Unknown User"}
        </h1> */}
        {data.current_title && (
          <p className="text-xl text-slate-600 font-medium tracking-wide">
            {data.current_title}
          </p>
        )}
      </div>

      {/* Location and experience info */}
      <div className="flex flex-wrap items-center gap-6 text-slate-500">
        {data.location && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <MapPin className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium">{data.location}</span>
          </div>
        )}
        {yearsOfExperience > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium">
              {yearsOfExperience.toFixed(1)} year{yearsOfExperience !== 1 ? 's' : ''} experience
            </span>
          </div>
        )}
      </div>

      {/* Social links */}
      {data.social_links && data.social_links.length > 0 && (
        <div className="flex gap-2 pt-2">
          {data.social_links.map((link, index) => {
            const IconComponent = socialIcons[link.platform];
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
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