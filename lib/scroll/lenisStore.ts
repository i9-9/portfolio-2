type LenisInstance = import("lenis").default;

let landingLenis: LenisInstance | null = null;

export function setLandingLenis(instance: LenisInstance | null) {
  landingLenis = instance;
}

export function getLandingLenis() {
  return landingLenis;
}
