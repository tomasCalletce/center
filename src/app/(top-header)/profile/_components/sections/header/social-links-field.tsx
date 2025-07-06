"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import {
  socialLinkSchema,
  type UserSocialLink,
} from "~/server/db/schemas/users";

interface SocialLinksFieldProps {
  socialLinks: UserSocialLink[];
  onChange: (socialLinks: UserSocialLink[]) => void;
}

export const SocialLinksField = ({
  socialLinks,
  onChange,
}: SocialLinksFieldProps) => {
  const [newLink, setNewLink] = useState<UserSocialLink>({
    platform: socialLinkSchema.shape.platform.Values.linkedin,
    url: "",
  });

  const addSocialLink = () => {
    if (newLink.url.trim()) {
      const updatedLinks = [
        ...socialLinks,
        { ...newLink, url: newLink.url.trim() },
      ];
      onChange(updatedLinks);
      setNewLink({
        platform: socialLinkSchema.shape.platform.Values.linkedin,
        url: "",
      });
    }
  };

  const removeSocialLink = (index: number) => {
    onChange(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: keyof UserSocialLink,
    value: string
  ) => {
    const updated = socialLinks.map((link, i) => {
      if (i === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Select
          value={newLink.platform}
          onValueChange={(value) =>
            setNewLink({
              ...newLink,
              platform: value as UserSocialLink["platform"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(socialLinkSchema.shape.platform.Values).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="URL"
            className="col-span-1"
          />
          <Button onClick={addSocialLink} type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={link.platform}
              onValueChange={(value) =>
                updateSocialLink(index, "platform", value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(socialLinkSchema.shape.platform.Values).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Input
              value={link.url}
              onChange={(e) => updateSocialLink(index, "url", e.target.value)}
              placeholder="URL"
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeSocialLink(index)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
