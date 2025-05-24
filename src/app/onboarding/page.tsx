import { CreateUserForm } from "~/app/onboarding/_components/create-user-from";

export default function OnboardingComponent() {
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
