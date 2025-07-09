import Image from "next/image";

export const CommunityShowcase = () => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center">
              <div className="h-1 w-8 bg-slate-900 rounded-full" />
              <span className="ml-3 text-sm uppercase tracking-wider font-medium text-muted-foreground">
                Global Developer Community
              </span>
            </div>
            <h2 className="text-3xl font-medium tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Where talent meets opportunity
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Join thousands of developers showcasing their skills through
              real-world challenges and connecting with innovative companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
                <Image
                  src="/team1.png"
                  alt="Developers collaborating on challenges"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">Build Together</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate with developers worldwide on exciting challenges
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
                <Image
                  src="/team2.png"
                  alt="Developer working on innovative solutions"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">Ship Quality Code</h3>
                <p className="text-sm text-muted-foreground">
                  Showcase your technical expertise through real projects
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
                <Image
                  src="/team3.png"
                  alt="Remote team celebrating success"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">Get Recognized</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with top companies looking for exceptional talent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
