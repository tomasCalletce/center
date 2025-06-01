import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";
import { MainSubmitBuildForm } from "~/app/talent/challenges/[_challenge]/builds/submit/_components/main-from";
import { Rocket } from "lucide-react";

export default async function SubmitBuildPage() {
  return (
    <HydrateClient>
      <Navigation>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Navigation>

      <div className="w-full px-6 py-6 space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 p-3 rounded-xl border border-primary/30 shadow-sm">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
                Submit Your Build
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your creativity and technical skills. Share your
                project with the community and let your work shine.
              </p>
            </div>
          </div>
        </div>

        <MainSubmitBuildForm />
      </div>
    </HydrateClient>
  );
}
