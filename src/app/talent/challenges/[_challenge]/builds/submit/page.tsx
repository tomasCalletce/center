import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";
import { MainSubmitBuildForm } from "~/app/talent/challenges/[_challenge]/builds/submit/_components/main-form";

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
      <div className="w-full px-6 py-6 space-y-6">
        <MainSubmitBuildForm />
      </div>
    </HydrateClient>
  );
}
