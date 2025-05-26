export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingStatus?: onboardingStatus;
    };
  }
}
