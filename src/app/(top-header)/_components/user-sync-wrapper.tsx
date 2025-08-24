"use client";

import { useSyncUser } from "~/hooks/use-sync-user";

export function UserSyncWrapper() {
  useSyncUser();
  return null;
}
