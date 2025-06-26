import { Zap } from "lucide-react";
import { UpcomingChallenges } from "~/app/(top-header)/challenges/_components/upcoming-challenges";

export const Challenges = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="relative container mx-auto py-4 md:py-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-6">
          <div className="mx-auto w-fit group">
            <div className="from-slate-900/20 via-slate-900/10 border-slate-900/20 relative flex h-20 w-20 items-center justify-center rounded-2xl border bg-gradient-to-br to-transparent shadow-lg">
              <div className="from-slate-900 to-slate-900/80 rounded-xl bg-gradient-to-br p-4 shadow-inner">
                <Zap className="text-white h-7 w-7" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
              Live Challenges
            </h1>
            <p className="mx-auto max-w-2xl md:text-xl text-muted-foreground leading-relaxed">
              Join developers worldwide in skill-based challenges. Build real
              projects, compete for prizes, and get noticed by top companies.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <UpcomingChallenges />
        </div>
      </div>
    </section>
  );
};
