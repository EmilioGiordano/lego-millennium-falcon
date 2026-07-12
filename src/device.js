const mobileQuery = matchMedia("(max-width: 760px)");

export function isMobileViewport() {
  return mobileQuery.matches;
}

export function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function mobilePixelRatioCap() {
  return isMobileViewport() ? 1 : 1.65;
}

export function isHeavyModel(totalParts) {
  return totalParts > 1500;
}
