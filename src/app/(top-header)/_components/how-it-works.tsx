import Image from "next/image";

export const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <div className="container border-y py-8 border-dashed mx-auto px-4">
        <div className="max-w-6xl space-y-6 mx-auto">
          <h2 className="text-3xl font-medium">How skill-based hiring works</h2>

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
                    profile, creating a dynamic portfolio of your capabilities.
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
                    Companies review challenge results and contact candidates
                    with proven skills that match their requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/team4.png"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
