import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export const TopHero = () => {
  return (
    <section className="relative border-b border-dashed py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center">
              <div className="h-1 w-8 bg-slate-900 rounded-full" />
              <span className="ml-3 text-sm uppercase tracking-wider font-medium">
                Skill-based hiring
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight">
              Build and get hired
              <span className="block text-3xl mt-2 font-normal">
                through skill-based challenges
              </span>
            </h1>

            <p className="text-muted-foreground">
              We host challenges and work to connect the best performers with
              top companies. Demonstrate your technical expertise through
              real-world problems and get discovered by blue-chip employers
              looking for exceptional talent.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="#"
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                  className: "px-6 relative",
                })}
              >
                Start Building
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </Link>

              <Link
                href="https://cal.com/tomas-calle-1oj8wr/30min"
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "px-6 border-dashed",
                })}
              >
                For employers
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1 relative h-full">
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/10 rounded-full border border-primary"></div>
          </div>

          <div className="md:col-span-6">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/team1.png"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/team2.png"
                    alt="Developer workspace"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/team3.png"
                    alt="Remote collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
