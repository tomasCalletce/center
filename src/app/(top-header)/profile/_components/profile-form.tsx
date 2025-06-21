import { api } from "~/trpc/server";
import { ProfileHeader } from "~/app/(top-header)/profile/_components/profile-header";
import { ProfileSkills } from "~/app/(top-header)/profile/_components/profile-skills";
import { ProfileExperience } from "~/app/(top-header)/profile/_components/profile-experience";
import { ProfileEducation } from "~/app/(top-header)/profile/_components/profile-education";
import { ProfileStats } from "~/app/(top-header)/profile/_components/profile-stats";

export const ProfileForm = async () => {
 let userProfile = null;

 try {
    userProfile = await api.user.getProfile();
 } catch (error) {
    console.error("Failed to fetch user profile:", error);
    userProfile = null;
 }

 if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <p className="text-muted-foreground">Please complete your onboarding first.</p>
      </div>
    );
 }

 return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ProfileHeader user={userProfile} />
          
          <ProfileSkills skills={userProfile.skills as any} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileStats user={userProfile as any} />
            <ProfileEducation education={userProfile.education as any} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ProfileExperience experience={userProfile.experience as any} />
        </div>
      </div>
    </div>
 );
};