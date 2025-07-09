import { Input } from "~/components/ui/input";
import { type User } from "~/server/db/schemas/users";
import { SocialLinksField } from "~/app/(top-header)/profile/_components/sections/header/social-links-field";

interface ProfileHeaderEditProps {
  user: User;
  onChange: (data: User) => void;
}

export const ProfileHeaderEdit = ({
  user,
  onChange,
}: ProfileHeaderEditProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Display Name</label>
          <Input
            disabled={true}
            value={user.display_name || "ACC Competitor"}
            onChange={(e) =>
              onChange({ ...user, display_name: e.target.value })
            }
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Current Title
          </label>
          <Input
            value={user.current_title || ""}
            onChange={(e) =>
              onChange({ ...user, current_title: e.target.value })
            }
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <Input
          value={user.location || ""}
          onChange={(e) => onChange({ ...user, location: e.target.value })}
          placeholder="e.g., San Francisco, CA"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Social Links</label>
        <SocialLinksField
          socialLinks={user.social_links || []}
          onChange={(socialLinks) =>
            onChange({ ...user, social_links: socialLinks })
          }
        />
      </div>
    </div>
  );
};
