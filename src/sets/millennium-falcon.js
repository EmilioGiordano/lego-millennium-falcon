import { sharedAnimation } from "./shared.js";

export const millenniumFalcon = Object.freeze({
  id: "millennium-falcon",
  route: "millennium-falcon",
  navigationLabel: "Millennium Falcon",
  name: "LEGO 75192 Millennium Falcon",
  completionLabel: "YT-1300 complete",
  ui: {
    documentTitle: "Millennium Falcon Assembly",
    canvasLabel: "LEGO bricks swirling into the Millennium Falcon",
    eyebrow: "A long time ago, in a toy box far, far away...",
    headingLead: "Build the",
    headingLines: ["fastest hunk", "of bricks."],
    introLines: [
      "Hundreds of loose bricks. One legendary freighter.",
      "Watch every stud lock into place.",
    ],
    footerLeft: "Corellian Engineering Corporation",
    footerRight: "Unofficial fan experiment",
  },
  assets: {
    manifest: new URL(
      "../../assets/sets/millennium-falcon/scene.json",
      import.meta.url,
    ).href,
    geometries: new URL(
      "../../assets/sets/millennium-falcon/geometries.zip",
      import.meta.url,
    ).href,
  },
  audio: {
    build: new URL(
      "../../assets/audio/lego-build-process.mp3?v=2",
      import.meta.url,
    ).href,
    complete: new URL(
      "../../assets/audio/lego-build-complete.mp3",
      import.meta.url,
    ).href,
  },
  material: {
    emissiveReferences: [42],
  },
  camera: {
    initialPitch: 0.73,
    desktopDistance: 2050,
    mobileDistance: 3000,
    mobileBreakpoint: 760,
    lookAt: [0, 6, 0],
    desktopModelRotation: -0.12,
    mobileModelRotation: -0.5,
    minPitch: -1.34,
    maxPitch: 1.34,
    minZoom: 0.4,
    maxZoom: 1.55,
    fogZoomScale: 0.68,
  },
  animation: sharedAnimation,
});
