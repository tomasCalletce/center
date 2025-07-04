import {
  TextField,
  SocialLinksField,
} from "~/app/(top-header)/profile/_components/form-controls";
import { type User } from "~/server/db/schemas/users";

interface ProfileHeaderEditProps {
  data: User;
  onChange: (data: User) => void;
}

export const ProfileHeaderEdit = ({
  data,
  onChange,
}: ProfileHeaderEditProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Display Name</label>
          <TextField
            value={data.display_name || ""}
            onChange={(value) => onChange({ ...data, display_name: value })}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Current Title
          </label>
          <TextField
            value={data.current_title || ""}
            onChange={(value) => onChange({ ...data, current_title: value })}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <TextField
          value={data.location || ""}
          onChange={(value) => onChange({ ...data, location: value })}
          placeholder="e.g., San Francisco, CA"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Social Links</label>
        <SocialLinksField
          socialLinks={data.social_links || []}
          onChange={(socialLinks) =>
            onChange({ ...data, social_links: socialLinks })
          }
        />
      </div>
    </div>
  );
};
