import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "~/app/_components/footer";
import { Header } from "~/app/_components/header";
import { buttonVariants } from "~/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative">
          {/* Full-height hero with distinctive split design */}
          <div className="h-[85vh] grid grid-cols-1 md:grid-cols-12">
            {/* Left section - Primary content */}
            <div className="md:col-span-6 flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <div className="max-w-xl">
                <div className="mb-8 inline-flex items-center">
                  <div className="h-px w-12 bg-primary"></div>
                  <span className="ml-4 text-sm uppercase tracking-wider">
                    Cada 2 semanas
                  </span>
                </div>

                <h1 className="text-7xl font-bold tracking-tight mb-8">
                  ACC<span className="text-primary">.</span>
                </h1>

                <p className="text-2xl mb-6 text-muted-foreground max-w-md">
                  Competencias técnicas extraordinarias
                </p>

                <p className="text-lg mb-12 max-w-lg">
                  Demuestra tus habilidades para conectar con oportunidades de
                  escala global.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "text-base px-8",
                    })}
                  >
                    Participar en desafíos
                  </Link>

                  <Link
                    href="#how-it-works"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "text-base px-8 border-dashed",
                    })}
                  >
                    Cómo funciona
                  </Link>
                </div>
              </div>
            </div>

            {/* Right section - Enhanced visual element */}
            <div className="md:col-span-6 bg-muted relative overflow-hidden hidden md:block">
              {/* Large background number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[20rem] font-bold text-primary/5 select-none">
                  01
                </div>
              </div>

              {/* Challenge grid pattern - more prominent */}
              <div className="absolute inset-0 flex items-center justify-center p-16">
                <div className="relative w-full max-w-lg aspect-square">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="relative p-2">
                        <div
                          className={`
                          h-full w-full rounded-sm border-2 border-dashed
                          ${
                            i === 4
                              ? "bg-primary/10 border-primary"
                              : "border-border/70"
                          }
                          transition-all duration-500 hover:border-primary/70
                        `}
                        >
                          {i === 4 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 bg-primary rounded-full"></div>
                            </div>
                          )}
                          {i !== 4 && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Animated circles */}
                  <div className="absolute -inset-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-primary/20 rounded-full opacity-60 animate-pulse-subtle"></div>
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-dashed border-primary/30 rounded-full opacity-70 animate-pulse-subtle"
                      style={{ animationDelay: "2s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 text-2xl font-bold">
                ACC<span className="text-primary">.</span>
              </div>

              <div className="absolute bottom-8 left-8 py-2 px-4 border-2 border-dashed bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">01</div>
                  <div className="text-sm">
                    <div className="font-medium">Reto Actual</div>
                    <div className="text-muted-foreground">
                      Backend Challenge
                    </div>
                  </div>
                </div>
              </div>

              {/* Border separator */}
              <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dashed"></div>
            </div>
          </div>

          {/* Bottom border with indicators */}
          <div className="h-16 border-t border-dashed relative">
            <div className="container mx-auto px-4 h-full">
              <div className="flex justify-between items-center h-full">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium">01 / 10</span>
                  <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                    <div className="w-1/10 h-full bg-primary"></div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="w-2 h-2 rounded-full bg-border"></div>
                  <div className="w-2 h-2 rounded-full bg-border"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline mb-16">
                <div className="w-12 h-px bg-primary mr-6"></div>
                <h2 className="text-3xl font-medium">
                  From the creators of ai-hackathon.co
                </h2>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 border border-dashed rounded-sm">
                  <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full mb-6">
                    <span className="text-xl font-medium">01</span>
                  </div>
                  <h3 className="text-xl font-medium mb-4">
                    Desafíos Técnicos
                  </h3>
                  <p className="text-muted-foreground">
                    Resuelve problemas reales de la industria en competencias
                    quincenales.
                  </p>
                </div>

                <div className="p-8 border border-dashed rounded-sm">
                  <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full mb-6">
                    <span className="text-xl font-medium">02</span>
                  </div>
                  <h3 className="text-xl font-medium mb-4">Reconocimiento</h3>
                  <p className="text-muted-foreground">
                    Destaca entre los mejores y gana visibilidad en la comunidad
                    tech.
                  </p>
                </div>

                <div className="p-8 border border-dashed rounded-sm">
                  <div className="w-12 h-12 flex items-center justify-center border border-dashed rounded-full mb-6">
                    <span className="text-xl font-medium">03</span>
                  </div>
                  <h3 className="text-xl font-medium mb-4">Oportunidades</h3>
                  <p className="text-muted-foreground">
                    Conecta con startups en crecimiento buscando talento
                    excepcional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="p-12 border border-dashed">
                <p className="text-3xl md:text-4xl font-medium leading-tight max-w-3xl">
                  <span className="text-muted-foreground">
                    AI promised to fix recruitment.
                  </span>
                  <span className="block mt-4">
                    Instead, it broke the industry.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </HydrateClient>
  );
}
