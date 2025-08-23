"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const syncMutation = api.user.syncClerkData.useMutation();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !syncMutation.isPending && !hasRunRef.current) {
      hasRunRef.current = true;
      syncMutation.mutate(undefined, {
        onError: () => {
          hasRunRef.current = false;
        },
      });
    }
  }, [isLoaded, user?.id, syncMutation]);

  return {
    isSyncing: syncMutation.isPending,
    error: syncMutation.error,
  };
}
