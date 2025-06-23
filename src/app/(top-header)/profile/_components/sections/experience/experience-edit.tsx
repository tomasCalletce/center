import { ExperienceField } from "~/app/(top-header)/profile/_components/form-controls/experience-field";
import { type EmploymentType } from "~/server/db/schemas/users";

interface Experience {
  title?: string | null;
  company?: string | null;
  employment_type?: EmploymentType | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  skills_used?: string[] | null;
}

interface ExperienceEditProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

export const ExperienceEdit = ({
  experience,
  onChange,
}: ExperienceEditProps) => {
  return <ExperienceField experience={experience} onChange={onChange} />;
}; 