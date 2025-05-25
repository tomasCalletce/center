import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "~/app/_components/footer";
import { Button, buttonVariants } from "~/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-background text-foreground">
        {/* First Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-12 max-w-6xl mx-auto">
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                  ACC<span className="text-primary">.</span>
                </h1>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-medium">
                  Find work in the most promising startups.
                </p>
              </div>
              <div>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    className: "text-lg",
                  })}
                  href="/challenges"
                >
                  Participate in challenges
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Second Hero Section */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-3xl md:text-4xl font-medium">
                From the creators of ai-hackathon.co
              </p>
            </div>
          </div>
        </section>

        {/* Third Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-3xl md:text-4xl font-medium leading-tight max-w-3xl">
                <span className="text-muted-foreground">
                  AI promised to fix recruitment.
                </span>
                <span className="block mt-2">
                  Instead, it broke the industry.
                </span>
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </HydrateClient>
  );
}
