import { Zap } from "lucide-react";
import { UpcomingChallenges } from "~/app/(top-header)/_components/upcoming-challenges";

export const Challenges = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="relative container mx-auto py-4">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className="from-slate-900/30 via-slate-900/15 border-slate-900/30 relative flex h-8 w-8 items-center justify-center rounded-lg border bg-gradient-to-br to-transparent shadow-lg">
              <Zap className="text-slate-900 h-4 w-4" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
              AI Challenges
            </h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            Participate and sign up to ACC IA challenges to showcase your
            skills.
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <UpcomingChallenges />
        </div>
      </div>
    </section>
  );
};
