import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";

export const ProfileForm = async () => {
 let userProfile = null;

 try {
    userProfile = await api.user.getProfile();
 } catch (error) {
    console.error("Failed to fetch user profile:", error);
    userProfile = null;
 }

 return (
    <HydrateClient>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p>{userProfile?.current_title}</p>
        </div>
        
    </HydrateClient>
 
 )
}