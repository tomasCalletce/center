import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";

export default async function Home() {
  return (
    <HydrateClient>
      <Navigation>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>General</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Navigation>
      <div className="w-full px-6 py-4">que mas</div>
    </HydrateClient>
  );
}
