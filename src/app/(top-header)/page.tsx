import Link from "next/link";
import Image from "next/image";
import { HydrateClient } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";
import { AiHackathon } from "./_components/ia-hackathon";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="space-y-16">
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
                  We host challenges and work to connect the best performers
                  with top companies. Demonstrate your technical expertise
                  through real-world problems and get discovered by blue-chip
                  employers looking for exceptional talent.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "default",
                      size: "default",
                      className: "px-6",
                    })}
                  >
                    Start Building
                  </Link>

                  <Link
                    href="mailto:team@letsacc.com"
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

        <AiHackathon />

        <section id="how-it-works">
          <div className="container border-y py-8 border-dashed mx-auto px-4">
            <div className="max-w-6xl space-y-6 mx-auto">
              <h2 className="text-3xl font-medium">
                How skill-based hiring works
              </h2>

              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full shrink-0">
                      <span className="text-xl font-medium">01</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Participate in challenges
                      </h3>
                      <p className="text-muted-foreground">
                        Complete real-world technical challenges designed to
                        showcase your skills and problem-solving abilities.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full shrink-0">
                      <span className="text-xl font-medium">02</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Build your portfolio
                      </h3>
                      <p className="text-muted-foreground">
                        Each completed challenge adds to your verified skill
                        profile, creating a dynamic portfolio of your
                        capabilities.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full shrink-0">
                      <span className="text-xl font-medium">03</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Get matched with opportunities
                      </h3>
                      <p className="text-muted-foreground">
                        Companies review challenge results and contact
                        candidates with proven skills that match their
                        requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative border border-dashed p-1 aspect-video overflow-hidden">
                  <Image
                    src="/team2.png"
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section>
          <div className="container mx-auto px-4 mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/see_sky.png"
                      alt="Talented developers reaching new heights"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-8 bg-slate-900 rounded-full" />
                      <span className="ml-3 text-sm uppercase tracking-wider font-medium">
                        For Companies
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight">
                      World class talent for world class startups
                    </h2>
                  </div>

                  <div className="text-muted-foreground">
                    <p>
                      Connect with talent that is able to take products from 0
                      to 1. Hire based on results, products built, and
                      challenges passed instead of worthless credentials.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="mailto:team@letsacc.com"
                      className={buttonVariants({
                        variant: "default",
                        size: "default",
                        className: "px-6 w-56",
                      })}
                    >
                      Partner with us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
