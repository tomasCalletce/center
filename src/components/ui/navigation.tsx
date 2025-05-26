import { SidebarTrigger } from "./sidebar";
import { cn } from "~/lib/utils";

interface NavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-border flex items-center gap-2 border-b pb-2",
        className
      )}
    >
      <SidebarTrigger />
      {children}
    </div>
  );
};
