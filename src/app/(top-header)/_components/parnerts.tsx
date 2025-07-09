import Image from "next/image";

export const Partners = () => {
  return (
    <section className="relative bg-slate-50/50 border-t border-slate-200/50">
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left side - Text content */}
            <div className="space-y-3 md:space-y-4">
              <div className="inline-flex items-center">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <span className="ml-3 text-sm uppercase tracking-wider font-medium text-muted-foreground">
                  Our Partners
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                World class partners
              </h2>
            </div>

            {/* Right side - Logo */}
            <div className="flex justify-center md:justify-end">
              <div className="relative h-10 w-48 md:h-16 md:w-80">
                <Image
                  src="/Overdrive_logo_horizontal_dark.png"
                  alt="Overdrive"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
