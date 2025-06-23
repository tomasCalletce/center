import { Linkedin, Github, Globe, Folder } from "lucide-react";

export const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  portfolio: Folder
}; 