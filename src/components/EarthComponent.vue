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
    let earthBlob: THREE.Mesh;
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const initScene = () => {
      // Set up the scene, camera, and renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,
        1000
      );
      camera.position.set(0, 0, 15);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement);
      }

      document.addEventListener("mousemove", onDocumentMouseMove, false);
    };

    const createEarthBlob = () => {
      // Create the Earth blob geometry and material
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        "https://images.unsplash.com/photo-1634176866089-b633f4aec882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
      );
      const material = new THREE.MeshBasicMaterial({ map: texture });

      // Creating the Earth blob mesh to add it to the scene.
      earthBlob = new THREE.Mesh(geometry, material);
      scene.add(earthBlob);
    };

    const animate = () => {
      // Animation loop
      requestAnimationFrame(animate);
      // Update the Earth blob's rotation based on cursor position.
      if (earthBlob) {
        earthBlob.rotation.y = mouseX * 1;
        earthBlob.rotation.x = mouseY * 1;
      }
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
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
      }
    };

    const onDocumentMouseMove = (event: MouseEvent) => {
      // Update mouseX and mouseY based on cursor position
      mouseX = (event.clientX - windowHalfX) / windowHalfX;
      mouseY = (event.clientY - windowHalfY) / windowHalfY;
    };

    onMounted(() => {
      initScene();
      createEarthBlob();
      animate();
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove, false);
    });

    return { canvasContainer };
  },
});
</script>

<style>
.canvas-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0.85;
}
</style>
