import { api } from "~/trpc/server";
import { ProfileHeader } from "~/app/(top-header)/profile/_components/sections/header";
import { ProfileSkills } from "~/app/(top-header)/profile/_components/sections/skills";
import { ProfileExperience } from "~/app/(top-header)/profile/_components/sections/experience";
import { ProfileEducation } from "~/app/(top-header)/profile/_components/sections/education";

export default async function ProfilePage() {
  const userProfile = await api.user.getProfile();

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <p className="text-muted-foreground">
          Please complete your onboarding first.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30">
      <div className="container mx-auto px-2 py-12 max-w-7xl">
        {/* Profile Header - Full Width */}
        <div className="mb-10">
          <ProfileHeader />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Primary Content - Experience */}
          <div className="xl:col-span-8 space-y-8">
            {/* <ProfileExperience /> */}
          </div>

          {/* Secondary Content - Skills & Education */}
          <div className="xl:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-6">
              <ProfileSkills skills={userProfile.skills as any} />
              <ProfileEducation education={userProfile.education as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
