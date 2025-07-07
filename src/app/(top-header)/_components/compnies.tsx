import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export const Companies = () => {
  return (
    <section>
      <div className="container mx-auto my-16 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <h2 className="text-sm uppercase tracking-wider font-medium">
                  For Companies
                </h2>
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                World class talent for world class startups
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with talent that is able to take products from 0 to 1.
                Hire based on results and products built instead of worthless
                credentials.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="https://cal.com/tomas-calle-1oj8wr/30min"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "px-12 py-3 text-lg",
                })}
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
