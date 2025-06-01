import Link from "next/link";
import Image from "next/image";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "~/app/_components/footer";
import { Header } from "~/app/_components/header";
import { buttonVariants } from "~/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section - Redesigned */}
        <section className="relative border-b border-dashed">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left content */}
              <div className="md:col-span-5 space-y-6">
                <div className="inline-flex items-center">
                  <div className="h-px w-8 bg-primary"></div>
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

              {/* Center dot pattern */}
              <div className="hidden md:block md:col-span-1 relative h-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/10 rounded-full border border-primary"></div>
              </div>

              {/* Right image grid */}
              <div className="md:col-span-6 grid grid-cols-2 gap-3 h-[320px]">
                <div className="relative h-full rounded-sm overflow-hidden border border-dashed p-1">
                  <Image
                    src="/team1.png"
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="relative rounded-sm overflow-hidden border border-dashed p-1">
                    <Image
                      src="/team2.png"
                      alt="Team collaboration"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-sm overflow-hidden border border-dashed p-1">
                    <Image
                      src="/team3.png"
                      alt="Team collaboration"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Hackathon Creators Section */}
        <section className="py-16 border-b border-dashed">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-sm overflow-hidden">
                  <Image
                    src="/ai-hackathon.jpeg"
                    alt="AI Hackathon Event"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-8">
                  <div className="flex items-baseline">
                    <div className="w-8 h-px bg-primary mr-4"></div>
                    <h2 className="text-2xl font-medium">
                      From the creators of ai-hackathon.co
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">800+</div>
                      <div className="text-sm text-muted-foreground">
                        Participants
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">$4,000+</div>
                      <div className="text-sm text-muted-foreground">
                        In cash prizes
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">60+</div>
                      <div className="text-sm text-muted-foreground">
                        Project entries
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">300K+</div>
                      <div className="text-sm text-muted-foreground">
                        LinkedIn views
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline mb-16">
                <div className="w-12 h-px bg-primary mr-6"></div>
                <h2 className="text-3xl font-medium">
                  How skill-based hiring works
                </h2>
              </div>

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

        {/* Featured challenges */}
        {/* <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline mb-16">
                <div className="w-12 h-px bg-primary mr-6"></div>
                <h2 className="text-3xl font-medium">Featured challenges</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="border border-dashed group hover:border-primary transition-colors duration-300">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/team3.png"
                      alt="Frontend challenge"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 py-1 px-3 bg-background/80 backdrop-blur-sm text-xs font-medium">
                      Frontend
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">
                      Interactive Dashboard
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Build a responsive analytics dashboard with data
                      visualization components.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2 weeks duration</span>
                      <Link
                        href="/challenges/frontend"
                        className="text-primary flex items-center gap-1 group-hover:underline"
                      >
                        View challenge <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed group hover:border-primary transition-colors duration-300">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/team4.png"
                      alt="Backend challenge"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 py-1 px-3 bg-background/80 backdrop-blur-sm text-xs font-medium">
                      Backend
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">
                      API Performance Optimization
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Optimize a slow-performing REST API for scalability and
                      response time.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">3 weeks duration</span>
                      <Link
                        href="/challenges/backend"
                        className="text-primary flex items-center gap-1 group-hover:underline"
                      >
                        View challenge <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-dashed group hover:border-primary transition-colors duration-300">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src="/team1.png"
                      alt="Full-stack challenge"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 py-1 px-3 bg-background/80 backdrop-blur-sm text-xs font-medium">
                      Full-stack
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">
                      Collaborative Workspace
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create a real-time collaborative workspace with
                      authentication and persistence.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">4 weeks duration</span>
                      <Link
                        href="/challenges/fullstack"
                        className="text-primary flex items-center gap-1 group-hover:underline"
                      >
                        View challenge <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Companies Section
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline mb-16">
                <div className="w-12 h-px bg-primary mr-6"></div>
                <h2 className="text-3xl font-medium">For companies</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                <div className="relative border border-dashed p-1 aspect-video overflow-hidden">
                  <Image
                    src="/team3.png"
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Skill-verified candidates
                      </h3>
                      <p className="text-muted-foreground">
                        Access candidates who have demonstrated their technical
                        skills through practical, real-world challenges.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Objective evaluation
                      </h3>
                      <p className="text-muted-foreground">
                        Compare candidates based on performance metrics and
                        practical results rather than resumes alone.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Faster hiring process
                      </h3>
                      <p className="text-muted-foreground">
                        Reduce time-to-hire by connecting with pre-screened
                        candidates who have already demonstrated relevant
                        skills.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/for-companies"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "text-base px-8 mt-4",
                    })}
                  >
                    Get started with ACC
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Testimonial Section
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="p-12 border border-dashed">
                <p className="text-3xl md:text-4xl font-medium leading-tight max-w-3xl">
                  <span className="text-muted-foreground">
                    "ACC has transformed our hiring process.
                  </span>
                  <span className="block mt-4">
                    We now hire based on verified skills, not just experience."
                  </span>
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">TC</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Thomas Calle</h4>
                    <p className="text-sm text-muted-foreground">
                      CTO, Future Vision Tech
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        {/* <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to showcase your skills?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are proving their abilities and
                finding opportunities through ACC challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "text-base px-8",
                  })}
                >
                  Join talent pool
                </Link>
                <Link
                  href="/challenges"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "text-base px-8 border-dashed",
                  })}
                >
                  Browse challenges
                </Link>
              </div>
            </div>
          </div>
        </section> */}

        <Footer />
      </main>
    </HydrateClient>
  );
}
