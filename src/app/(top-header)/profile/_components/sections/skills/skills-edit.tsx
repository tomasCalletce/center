import { SkillsField } from "~/app/(top-header)/profile/_components/form-controls";

interface SkillsEditProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsEdit = ({ skills, onChange }: SkillsEditProps) => {
  return <SkillsField skills={skills} onChange={onChange} />;
}; 