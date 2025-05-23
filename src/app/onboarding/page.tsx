"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "~/app/onboarding/_actions";
import { CreateUserForm } from "~/app/onboarding/_components/create-user-from";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Comenzar
          </h1>
          <p className="text-zinc-600">Crea tu organización para continuar</p>
        </div>
        <CreateUserForm />
      </div>
    </div>
  );
}
