import * as THREE from "../../assets/vendor/three.module.js";
import { isMobileViewport, mobilePixelRatioCap } from "../device.js";
import { hash, TAU } from "../math.js";

export function createStage(canvas, initialSet) {
  let set = initialSet;
  const mobile = isMobileViewport();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobilePixelRatioCap()));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const hemisphereLight = new THREE.HemisphereLight(0xd8e6e9, 0x171c24, 4.2);
  const keyLight = new THREE.DirectionalLight(0xffe7c3, 7.4);
  keyLight.position.set(-500, 900, 450);
  const undersideLight = new THREE.DirectionalLight(0x9fb9c5, 3.2);
  undersideLight.position.set(0, -900, 260);
  const rimLight = new THREE.PointLight(0x55b9dc, 420000, 2200);
  rimLight.position.set(-700, 260, -620);
  const warmLight = new THREE.PointLight(0xef4b2f, 190000, 1700);
  warmLight.position.set(650, 380, 560);

  renderer.setClearColor(0x02050a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050a, 0.00052);
  const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 1, 7000);
  camera.position.set(0, 1040, 1120);

  scene.add(hemisphereLight);
  scene.add(keyLight);
  scene.add(undersideLight);
  scene.add(rimLight);
  scene.add(warmLight);

  function applyLighting(nextSet) {
    const lightScale = nextSet.rendering?.lightScale ?? 1;
    const keyLightColor = nextSet.rendering?.keyLightColor ?? 0xffe7c3;
    const warmLightScale = nextSet.rendering?.warmLightScale ?? 1;
    renderer.toneMappingExposure = nextSet.rendering?.exposure ?? 1.55;
    hemisphereLight.intensity = 4.2 * lightScale;
    keyLight.color.setHex(keyLightColor);
    keyLight.intensity = 7.4 * lightScale;
    undersideLight.intensity = 3.2 * lightScale;
    rimLight.intensity = 420000 * lightScale;
    warmLight.intensity = 190000 * lightScale * warmLightScale;
  }

  applyLighting(set);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  const starCount = mobile ? (set.id === "millennium-falcon" ? 0 : 180) : 1100;
  for (let index = 0; index < starCount; index += 1) {
    const radius = 2100 + hash(index, 1) * 2300;
    const theta = hash(index, 2) * TAU;
    const y = (hash(index, 3) - 0.5) * 3000;
    starPositions.push(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
  }
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3),
  );
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xa9b9c0,
      size: 2.2,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true,
    }),
  );
  scene.add(stars);

  const shipRoot = new THREE.Group();
  const shipPivot = new THREE.Group();
  shipRoot.add(shipPivot);
  scene.add(shipRoot);

  const halo = mobile
    ? null
    : new THREE.Mesh(
        new THREE.RingGeometry(330, 780, 96),
        new THREE.MeshBasicMaterial({
          color: 0x224858,
          transparent: true,
          opacity: 0.065,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
  if (halo) {
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -120;
    scene.add(halo);
  }

  const onResize = () => {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobilePixelRatioCap()));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  addEventListener("resize", onResize);

  return {
    shipPivot,

    applySet(nextSet) {
      set = nextSet;
      applyLighting(nextSet);
    },

    render(time, orbit) {
      const mobile = innerWidth < set.camera.mobileBreakpoint;
      const cameraDistance =
        (mobile ? set.camera.mobileDistance : set.camera.desktopDistance) *
        orbit.zoom;
      scene.fog.density = 0.00052 * (set.camera.fogZoomScale / orbit.zoom);
      const horizontalDistance = Math.cos(orbit.pitch) * cameraDistance;
      camera.position.set(
        Math.sin(orbit.yaw) * horizontalDistance,
        Math.sin(orbit.pitch) * cameraDistance,
        Math.cos(orbit.yaw) * horizontalDistance,
      );
      camera.lookAt(...set.camera.lookAt);
      shipRoot.rotation.y = mobile
        ? set.camera.mobileModelRotation
        : set.camera.desktopModelRotation;
      stars.rotation.y = time * 0.000006;
      if (halo) halo.rotation.z = -time * 0.00004;
      renderer.render(scene, camera);
    },

    destroy() {
      removeEventListener("resize", onResize);
      renderer.dispose();
    },
  };
}
