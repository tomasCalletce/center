import { Info } from "lucide-react";
import { ProfileHeader } from "~/app/(top-header)/profile/_components/sections/header";
import { ProfileSkills } from "~/app/(top-header)/profile/_components/sections/skills";
import { ProfileExperience } from "~/app/(top-header)/profile/_components/sections/experience";
import { ProfileEducation } from "~/app/(top-header)/profile/_components/sections/education";

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30">
      <div className="container mx-auto px-2 py-12 max-w-7xl">
        {/* Privacy Notice */}
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 backdrop-blur-sm">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-3 h-3 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We combine this info with your challenge submissions to create a
              profile that demonstrates your real abilities through actual
              projects.
            </p>
          </div>
        </div>

        {/* Profile Header - Full Width */}
        <div className="mb-4">
          <ProfileHeader />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 space-y-8">
            <ProfileExperience />
          </div>

          {/* Secondary Content - Skills & Education */}
          <div className="xl:col-span-4 space-y-8">
            <div className="sticky top-20 space-y-4">
              <ProfileSkills />
              <ProfileEducation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
