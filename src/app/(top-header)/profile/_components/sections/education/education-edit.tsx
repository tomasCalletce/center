import { EducationField } from "~/app/(top-header)/profile/_components/form-controls/education-field";

interface Education {
  institution?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
}

interface EducationEditProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationEdit = ({
  education,
  onChange,
}: EducationEditProps) => {
  return <EducationField education={education} onChange={onChange} />;
}; 