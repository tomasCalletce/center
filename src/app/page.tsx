import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-background text-foreground flex items-center">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col space-y-12 max-w-6xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                ACC<span className="text-primary">.</span>
              </h1>
              <p className="text-xl md:text-2xl font-light tracking-tight text-muted-foreground">
                Competition Based Hiring
              </p>
            </div>

            <div>
              <p className="text-3xl md:text-5xl font-medium leading-tight max-w-3xl">
                <span className="text-muted-foreground">
                  AI promised to fix recruitment.
                </span>
                <span className="block mt-2">
                  Instead, it broke the industry.
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
