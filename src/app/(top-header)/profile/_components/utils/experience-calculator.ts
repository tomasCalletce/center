interface ExperiencePeriod {
  start_date?: string | null;
  end_date?: string | null;
}

export const calculateYearsOfExperience = (experience?: ExperiencePeriod[] | null): number => {
  if (!experience || experience.length === 0) return 0;

  const currentDate = new Date();
  let totalMonths = 0;

  experience.forEach((exp) => {
    if (!exp.start_date) return;

    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date && exp.end_date.toLowerCase() !== "present" 
      ? new Date(exp.end_date) 
      : currentDate;

    if (startDate <= endDate) {
      const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth());
      totalMonths += monthsDiff;
    }
  });

  return Math.round((totalMonths / 12) * 10) / 10;
}; 