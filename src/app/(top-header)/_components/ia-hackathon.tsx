import Image from "next/image";

export const AiHackathon = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gray-50 border border-dashed p-4  rounded-xl">
            <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
              <Image
                src="/ai-hackathon.jpeg"
                alt="AI Hackathon Event"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-slate-900 rounded-full" />
                  <span className="ml-3 text-sm uppercase tracking-wider font-medium">
                    Track Record
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  From the creators of ai-hackathon.co
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">800+</div>
                  <div className="text-sm text-muted-foreground">
                    Participants
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">$4,000+</div>
                  <div className="text-sm text-muted-foreground">
                    In cash prizes
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">60+</div>
                  <div className="text-sm text-muted-foreground">
                    Project entries
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">300K+</div>
                  <div className="text-sm text-muted-foreground">
                    LinkedIn views
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <span className="ml-3 text-sm uppercase tracking-wider font-medium">
                  Event Highlights
                </span>
              </div>

              <h3 className="text-3xl font-medium tracking-tight">
                Watch our hackathon in action
              </h3>

              <p className="text-muted-foreground max-w-2xl">
                Experience the energy, innovation, and collaboration from our
                successful AI hackathon event. See the teams in action and
                witness the breakthrough solutions that emerged.
              </p>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-slate-50">
              <iframe
                src="https://www.youtube.com/embed/VzN9gE7CRow"
                title="AI Hackathon Event Recap"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
