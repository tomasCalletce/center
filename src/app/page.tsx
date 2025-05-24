import { HydrateClient } from "~/trpc/server";
import { Github, Twitter, Linkedin } from "lucide-react";

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
                <p className="text-2xl md:text-3xl font-medium leading-tight max-w-3xl">
                  <span className="block font-semibold">
                    Find work in the most promising startups.
                  </span>
                  <span className="block mt-2 text-muted-foreground">
                    Join ACC to participate in challenges proposed by our
                    partners, showcase your skills, and get recruited.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Second Hero Section */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-3xl md:text-4xl font-medium">
                From the creators of AI-Hakathon
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

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <h3 className="text-base font-medium">ACC.</h3>
                <p className="text-sm text-muted-foreground">
                  Connecting talent with opportunities through competition-based
                  hiring.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ACC. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
