<template>
  <div class="canvas-container" ref="canvasContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";

export default defineComponent({
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Group;
    const particlesCount = 1000;
    const particleSpread = 3000;

    const initScene = () => {
      // Set up the scene, camera, and renderer.
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );

      createParticles();

      // Position the camera to center the particles
      camera.position.set(0, 0, particleSpread);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background

      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement);
      }
    };

    const createParticles = () => {
      // Create a group to hold all the particles
      particles = new THREE.Group();

      for (let i = 0; i < particlesCount; i++) {
        // Create a single particle
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(3);
        particlePositions[0] =
          Math.random() * particleSpread - particleSpread / 2;
        particlePositions[1] =
          Math.random() * particleSpread - particleSpread / 2;
        particlePositions[2] =
          Math.random() * particleSpread - particleSpread / 2;
        particleGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(particlePositions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
          size: Math.random() * 10 + 4,
          color: 0xffffff,
          transparent: true,
          opacity: Math.random() * 0.6 + 0.4,
          depthWrite: false,
          blending: THREE.AdditiveBlending, // Additive blending for a glowing effect
        });

        const particle = new THREE.Points(particleGeometry, particleMaterial);
        particles.add(particle);
      }

      scene.add(particles);
    };

    const animate = () => {
      // Animation loop
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0008; // Rotate the entire particles group slowly
      particles.children.forEach((particle: any) => {
        // Add twinkling effect by adjusting opacity
        particle.material.opacity = Math.random() * 0.8 + 0.8;
      });
      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    const handleResize = () => {
      // Update camera aspect ratio on window resize
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    onMounted(() => {
      initScene();
      animate();
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });

    return { canvasContainer };
  },
});
</script>

<style lang="scss" scoped>
.canvas-container {
  z-index: 1;
  pointer-events: none;
}
</style>
