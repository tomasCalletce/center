"use client";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const TextField = ({ value, onChange, placeholder, multiline }: TextFieldProps) => {
  if (multiline) {
    return (
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    );
  }
  
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}; 