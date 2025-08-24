"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function useSyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncMutation = api.user.syncClerkData.useMutation();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only attempt to sync if user is loaded, signed in, and we haven't run yet
    if (isLoaded && isSignedIn && user && !syncMutation.isPending && !hasRunRef.current) {
      hasRunRef.current = true;
      syncMutation.mutate(undefined, {
        onError: () => {
          hasRunRef.current = false;
        },
      });
    }
  }, [isLoaded, isSignedIn, user?.id, syncMutation]);

  return {
    isSyncing: syncMutation.isPending,
    error: syncMutation.error,
  };
}
