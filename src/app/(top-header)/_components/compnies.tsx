import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export const Companies = () => {
  return (
    <section>
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                  Connect with talent that is able to take products from 0 to 1.
                  Hire based on results and products built instead of worthless
                  credentials.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="https://cal.com/tomas-calle-1oj8wr/30min"
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
  );
};
