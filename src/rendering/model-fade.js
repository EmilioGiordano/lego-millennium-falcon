const FADE_MS = 700;
const MIN_SCALE = 0.86;

function restoreMaterials(model) {
  if (!model) return;
  for (const batch of model.batches) {
    const materials = Array.isArray(batch.mesh.material)
      ? batch.mesh.material
      : [batch.mesh.material];
    for (const material of materials) {
      if (material.userData.fadeBase === undefined) continue;
      material.opacity = material.userData.fadeBase;
      material.transparent = material.userData.fadeTransparent;
      material.depthWrite = material.userData.fadeDepthWrite;
      delete material.userData.fadeBase;
      delete material.userData.fadeTransparent;
      delete material.userData.fadeDepthWrite;
    }
  }
}

export function createModelFade({ reduceMotion = false } = {}) {
  let progress = 1;
  let fading = false;
  let lastNow = 0;

  return {
    reveal(model) {
      restoreMaterials(model);
      if (!model || reduceMotion) {
        model?.root.scale.setScalar(1);
        progress = 1;
        fading = false;
        return;
      }
      progress = 0;
      fading = true;
      lastNow = 0;
      model.root.scale.setScalar(MIN_SCALE);
    },

    tick(now, model) {
      if (!fading || !model) return;
      const delta = lastNow ? now - lastNow : 16;
      lastNow = now;
      progress = Math.min(1, progress + delta / FADE_MS);
      const eased = 1 - (1 - progress) ** 2;
      model.root.scale.setScalar(MIN_SCALE + (1 - MIN_SCALE) * eased);
      if (progress >= 1) {
        model.root.scale.setScalar(1);
        fading = false;
      }
    },
  };
}
