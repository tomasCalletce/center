import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";

export default async function SubmitBuildPage({
  params,
}: {
  params: Promise<{ _challenge: string }>;
}) {
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
      <div className="w-full px-6 py-6 space-y-6"></div>
    </HydrateClient>
  );
}
