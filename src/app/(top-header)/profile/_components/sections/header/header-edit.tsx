import {
  TextField,
  SocialLinksField,
} from "~/app/(top-header)/profile/_components/form-controls";
import { type User } from "~/server/db/schemas/users";

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
          <TextField
            value={user.display_name || "ACC Competitor"}
            onChange={(value) => onChange({ ...user, display_name: value })}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Current Title
          </label>
          <TextField
            value={user.current_title || ""}
            onChange={(value) => onChange({ ...user, current_title: value })}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <TextField
          value={user.location || ""}
          onChange={(value) => onChange({ ...user, location: value })}
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
