import * as THREE from "three";

/** Local-probe parallax correction: flat metal facets must vary with position,
 * not only their face normal, when reflecting the neighbouring medallions.
 * The enclosing box approximates local reflection depth; it is not ray tracing.
 */
export function projectPlateReflection(
  material: THREE.MeshStandardMaterial,
  probeCenter: THREE.Vector3
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.vedaProbeCenter = { value: probeCenter };
    shader.vertexShader =
      "varying vec3 vVedaWorldPosition;\n" +
      shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvVedaWorldPosition = worldPosition.xyz;"
      );
    const projection = `
      varying vec3 vVedaWorldPosition;
      uniform vec3 vedaProbeCenter;
      vec3 vedaParallaxDirection(vec3 direction) {
        vec3 safeDirection = (step(vec3(0.0), direction) * 2.0 - 1.0)
          * max(abs(direction), vec3(0.0001));
        vec3 nearBox = (vec3(-8.0, -5.0, -7.0) - vVedaWorldPosition) / safeDirection;
        vec3 farBox = (vec3(8.0, 5.0, 7.0) - vVedaWorldPosition) / safeDirection;
        vec3 exits = max(nearBox, farBox);
        float distanceToBox = min(min(exits.x, exits.y), exits.z);
        return normalize(vVedaWorldPosition + direction * distanceToBox - vedaProbeCenter);
      }
    `;
    const environmentChunk =
      THREE.ShaderChunk.envmap_physical_pars_fragment.replace(
        "reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );",
        "reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\nreflectVec = vedaParallaxDirection(reflectVec);"
      );
    shader.fragmentShader =
      projection +
      shader.fragmentShader.replace(
        "#include <envmap_physical_pars_fragment>",
        environmentChunk
      );
  };
  material.customProgramCacheKey = () => "veda-local-metal-reflections-v1";
}
