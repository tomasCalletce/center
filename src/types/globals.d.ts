export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingStatus?: onboardingStatus;
      isAdmin?: boolean;
    };
  }
}
