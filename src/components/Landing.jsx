import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// 3D Model Configuration - Replace with your .glb/.gltf file paths
const MODEL_CONFIG = {
  // Main interactive sphere - can be replaced with any 3D model
  mainSphere: {
    useModel: false, // Set to true to use .glb/.gltf instead of geometry
    modelPath: "/models/sphere.glb", // Path to your 3D model
    scale: [1, 1, 1],
    position: [0, 0, 0],
    // Fallback geometry settings (used when useModel is false)
    geometry: {
      type: "sphere", // sphere, box, dodecahedron, etc.
      radius: 5,
      segments: 32
    }
  },

  // Nebula clouds - can be individual 3D models
  nebulaClouds: {
    useModels: false,
    modelPath: "/models/nebula.glb",
    count: 8,
    scaleRange: [0.5, 2.0],
    // Fallback settings
    geometry: {
      type: "sphere",
      radius: 50,
      segments: 16
    }
  },

  // Asteroids - can be replaced with rock models
  asteroids: {
    useModels: false,
    modelPath: "/models/asteroid.glb",
    count: 12,
    scaleRange: [0.5, 3.0],
    // Fallback settings
    geometry: {
      type: "dodecahedron",
      radius: [2, 8] // min, max radius
    }
  },

  // Background elements (optional space structures)
  spaceStructures: {
    useModels: false,
    models: [
      "/models/space_station.glb",
      "/models/satellite.glb",
      "/models/debris.glb"
    ],
    count: 6,
    scaleRange: [10, 50]
  }
};

export default function SpaceLandingPage({ onEnter }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const sphereRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const particleSystemRef = useRef(null);
  const animationIdRef = useRef(null);
  const keysRef = useRef({});
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const loadedModelsRef = useRef({});
  const gltfLoaderRef = useRef(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const initScene = async () => {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000);
      mountRef.current.appendChild(renderer.domElement);

      // Store refs
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;

      // Create ambient space elements
      const createSpaceElements = () => {
        // Distant stars
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
          // Create a large 3D space with distant stars
          const radius = 800 + Math.random() * 1000;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);

          starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starPositions[i + 2] = radius * Math.cos(phi);
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1,
          transparent: true,
          opacity: 0.6
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Add nebula-like clouds (simplified for better compatibility)
        for (let i = 0; i < MODEL_CONFIG.nebulaClouds.count; i++) {
          const cloudGeometry = new THREE.SphereGeometry(50, 16, 16);
          const cloudMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.5, 0.1),
            transparent: true,
            opacity: 0.05
          });
          const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

          cloud.position.set(
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 800
          );

          scene.add(cloud);
        }

        // Add asteroid-like objects (simplified)
        for (let i = 0; i < MODEL_CONFIG.asteroids.count; i++) {
          const radius = 2 + Math.random() * 6;
          const asteroidGeometry = new THREE.DodecahedronGeometry(radius);
          const asteroidMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.7
          });
          const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

          asteroid.position.set(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 400
          );

          asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );

          scene.add(asteroid);
        }
      };

      createSpaceElements();

      // Create main interactive sphere (simplified to ensure it works)
      const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4A90E2,
        transparent: true,
        opacity: 0.9
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(0, 0, 0);
      scene.add(sphere);
      sphereRef.current = sphere;

      // Create particle system with FIXED initialization
      const maxParticles = 500;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(maxParticles * 3);
      const colors = new Float32Array(maxParticles * 3);
      const velocities = new Float32Array(maxParticles * 3);
      const lifetimes = new Float32Array(maxParticles);

      // IMPORTANT: Initialize all particles with zero alpha and set initial positions
      for (let i = 0; i < maxParticles; i++) {
        const i3 = i * 3;
        // Set all particles to origin initially
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
        
        // Set all velocities to zero initially
        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
        
        // Set lifetimes to 0 (inactive)
        lifetimes[i] = 0;
        
        // Set initial colors to transparent (will be set when particle becomes active)
        colors[i3] = 0;     // R
        colors[i3 + 1] = 0; // G  
        colors[i3 + 2] = 0; // B
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const textureLoader = new THREE.TextureLoader();
      const circleTexture = textureLoader.load("/circle.png");

      const particleMaterial = new THREE.PointsMaterial({
        size: 5, // Increased size for better visibility
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
        map: circleTexture,   // 👈 use PNG
        alphaTest: 0.5
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // Particle system state
      particleSystemRef.current = {
        positions,
        velocities,
        lifetimes,
        colors,
        geometry: particleGeometry,
        activeCount: 0
      };

      // Position camera in 3D space
      camera.position.set(0, 10, 50);
      camera.lookAt(0, 0, 0);

      // Mouse move handler for camera rotation
      const handleMouseMove = (event) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      // Keyboard handlers for 3D movement
      const handleKeyDown = (event) => {
        keysRef.current[event.code] = true;
        event.preventDefault();
      };

      const handleKeyUp = (event) => {
        keysRef.current[event.code] = false;
        event.preventDefault();
      };

      // Mouse click handler for sphere interaction
      const handleMouseDown = (event) => {
        if (!sphereRef.current) return;

        // Raycast to detect sphere click
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(sphereRef.current, true);
        if (intersects.length > 0) {
          isMouseDownRef.current = true;
        }
      };

      const handleMouseUp = () => {
        if (isMouseDownRef.current) {
          isMouseDownRef.current = false;
          setIsTransitioning(true);
          setTimeout(() => onEnter && onEnter(), 2000);
        }
      };

      // Add event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // FIXED emitParticle function
      const emitParticle = (fromCenter = false) => {
        const system = particleSystemRef.current;
        if (!system || !sphereRef.current) return;

        // Find an inactive particle
        let index = -1;
        for (let i = 0; i < maxParticles; i++) {
          if (system.lifetimes[i] <= 0) {
            index = i;
            break;
          }
        }

        if (index === -1) return; // No available particle slots

        const i3 = index * 3;
        const spherePos = sphereRef.current.position;

        if (fromCenter) {
          // Particles converging to sphere when holding
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = Math.random() * Math.PI;
          const radius = 20 + Math.random() * 30;

          system.positions[i3] = spherePos.x + Math.sin(angle2) * Math.cos(angle1) * radius;
          system.positions[i3 + 1] = spherePos.y + Math.sin(angle2) * Math.sin(angle1) * radius;
          system.positions[i3 + 2] = spherePos.z + Math.cos(angle2) * radius;

          // Velocity towards sphere center
          const dx = spherePos.x - system.positions[i3];
          const dy = spherePos.y - system.positions[i3 + 1];
          const dz = spherePos.z - system.positions[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          system.velocities[i3] = (dx / distance) * 0.8;
          system.velocities[i3 + 1] = (dy / distance) * 0.8;
          system.velocities[i3 + 2] = (dz / distance) * 0.8;

          system.lifetimes[index] = 0.5; // Set active lifetime

          // Set color to cyan for convergent particles
          system.colors[i3] = 0.0;     // R
          system.colors[i3 + 1] = 1.0; // G
          system.colors[i3 + 2] = 1.0; // B
        } else {
          // Particles emitting from sphere in all directions
          system.positions[i3] = spherePos.x;
          system.positions[i3 + 1] = spherePos.y;
          system.positions[i3 + 2] = spherePos.z;

          // Random 3D direction
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = Math.random() * Math.PI;
          const speed = 0.5 + Math.random() * 0.5;

          system.velocities[i3] = Math.sin(angle2) * Math.cos(angle1) * speed;
          system.velocities[i3 + 1] = Math.sin(angle2) * Math.sin(angle1) * speed;
          system.velocities[i3 + 2] = Math.cos(angle2) * speed;

          system.lifetimes[index] = Math.random() * 1.0; // Set active lifetime

          // Set color to white/yellow for emitted particles
          system.colors[i3] = 1.0;     // R
          system.colors[i3 + 1] = 1.0; // G
          system.colors[i3 + 2] = 0.5; // B (yellowish)
        }
      };

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Handle 3D movement with WASD and QE
        const moveSpeed = 1.5;
        const velocity = velocityRef.current;

        // Apply velocity with damping
        camera.position.x += velocity.x * 0.016;
        camera.position.y += velocity.y * 0.016;
        camera.position.z += velocity.z * 0.016;

        velocity.x *= 0.9;
        velocity.y *= 0.9;
        velocity.z *= 0.9;

        // Mouse look - rotate camera based on mouse position
        const lookSensitivity = 0.3;
        const spherePos = sphereRef.current ? sphereRef.current.position : new THREE.Vector3(0, 0, 0);

        // Create a point to look at that moves with mouse
        const lookTarget = new THREE.Vector3(
          spherePos.x + mouseRef.current.x * 20,
          spherePos.y + mouseRef.current.y * 15,
          spherePos.z
        );

        camera.lookAt(lookTarget);

        // Sphere animation
        if (sphereRef.current) {
          const time = Date.now() * 0.005;

          if (isMouseDownRef.current) {
            // Glowing and spinning when held
            sphereRef.current.material.color.setHex(0x00FFFF);
            sphereRef.current.material.opacity = 1.0;

            sphereRef.current.rotation.y += 0.08;
            sphereRef.current.rotation.x += 0.05;

            // Dramatic pulsing
            const glowScale = 1.5 + Math.sin(time * 4) * 0.3;
            sphereRef.current.scale.set(glowScale, glowScale, glowScale);

            // Emit particles rapidly when clicking
            if (Math.random() < 0.8) {
              emitParticle(true);
            }
          } else {
            // Normal state
            sphereRef.current.material.color.setHex(0x4A90E2);
            sphereRef.current.material.opacity = 0.9;

            sphereRef.current.rotation.y += 0.02;
            sphereRef.current.rotation.x += 0.01;

            // Gentle floating motion
            sphereRef.current.position.y = Math.sin(time * 0.5) * 2;

            const normalScale = 1 + Math.sin(time) * 0.15;
            sphereRef.current.scale.set(normalScale, normalScale, normalScale);

            // Regular particle emission (INCREASED FREQUENCY)
            if (Math.random() < 0.05) { // Increased from 0.15 to 0.3
              emitParticle(false);
            }
          }
        }

        // Update particles (FIXED)
        if (particleSystemRef.current) {
          const system = particleSystemRef.current;
          const deltaTime = 0.016;
          let hasActiveParticles = false;

          for (let i = 0; i < maxParticles; i++) {
            if (system.lifetimes[i] > 0) {
              hasActiveParticles = true;
              const i3 = i * 3;

              // Update position
              system.positions[i3] += system.velocities[i3];
              system.positions[i3 + 1] += system.velocities[i3 + 1];
              system.positions[i3 + 2] += system.velocities[i3 + 2];

              // Update lifetime
              system.lifetimes[i] -= deltaTime;

              // Update color intensity based on lifetime (fade effect)
              const initialLifetime = 2.5; // approximate max lifetime
              const lifeRatio = Math.max(0, Math.min(1, system.lifetimes[i] / initialLifetime));

              // Determine if this is a convergent or emitted particle based on velocity direction
              const speed = Math.sqrt(
                system.velocities[i3] * system.velocities[i3] +
                system.velocities[i3 + 1] * system.velocities[i3 + 1] +
                system.velocities[i3 + 2] * system.velocities[i3 + 2]
              );

              // Simple check: if it was set as cyan originally, keep it cyan
              const wasCyan = system.colors[i3] < 0.1 && system.colors[i3 + 1] > 0.9;
              
              if (wasCyan && system.lifetimes[i] > 0) {
                // Cyan particles (converging to sphere)
                system.colors[i3] = 0.0 * lifeRatio;     // R
                system.colors[i3 + 1] = 1.0 * lifeRatio; // G
                system.colors[i3 + 2] = 1.0 * lifeRatio; // B
              } else if (system.lifetimes[i] > 0) {
                // White/yellow particles (emitting from sphere)
                system.colors[i3] = 1.0 * lifeRatio;     // R
                system.colors[i3 + 1] = 1.0 * lifeRatio; // G
                system.colors[i3 + 2] = 0.5 * lifeRatio; // B (yellowish)
              }

              // Deactivate if lifetime expired
              if (system.lifetimes[i] <= 0) {
                system.colors[i3] = 0;
                system.colors[i3 + 1] = 0;
                system.colors[i3 + 2] = 0;
              }
            }
          }

          // Always update the attributes
          system.geometry.attributes.position.needsUpdate = true;
          system.geometry.attributes.color.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Start animation
      animate();

      // Cleanup function
      const cleanup = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('resize', handleResize);

        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };

      // Return cleanup function
      return cleanup;
    }; // End of initScene

    // Call the async initialization
    const cleanupPromise = initScene();
    
    // Cleanup on unmount
    return () => {
      if (cleanupPromise && typeof cleanupPromise.then === 'function') {
        cleanupPromise.then(cleanup => cleanup && cleanup());
      }
    };
  }, [onEnter]);

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-pointer bg-black"
         onClick={onEnter}>
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Instructions overlay */}
      <div className="absolute top-8 left-8 text-white z-10">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-2">Welcome to Kyle's 3D Universe</h1>
          <div className="text-sm space-y-1 opacity-90">
            <div>🖱️ <strong>Mouse:</strong> Look around</div>
            <div>✨ <strong>Click & hold sphere:</strong> See particle effects</div>
            <div>🚀 <strong>Click sphere:</strong> Enter website</div>
          </div>
        </div>
      </div>

      {/* Model Configuration Info */}
      <div className="absolute top-8 right-8 text-white z-10">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm text-sm">
          <h3 className="font-bold mb-2">3D Assets Status</h3>
          <div className="space-y-1 opacity-80">
            <div>Main Sphere: {MODEL_CONFIG.mainSphere.useModel ? "3D Model" : "Geometry"}</div>
            <div>Nebula: {MODEL_CONFIG.nebulaClouds.useModels ? "3D Models" : "Geometry"}</div>
            <div>Asteroids: {MODEL_CONFIG.asteroids.useModels ? "3D Models" : "Geometry"}</div>
            <div>Structures: {MODEL_CONFIG.spaceStructures.useModels ? "Enabled" : "Disabled"}</div>
            <div className="text-yellow-400 mt-2">⚡ Particles: Active</div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="text-center text-white">
          {isTransitioning && (
            <div className="text-3xl font-semibold animate-bounce bg-black/50 p-6 rounded-lg backdrop-blur-sm">
              ✨ Entering the website...
            </div>
          )}
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-4 h-4 border border-white/50 border-dashed"></div>
      </div>

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-white opacity-0 animate-fade-in-slow z-20"
             style={{ animation: 'fadeInSlow 2s ease-out forwards' }} />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
}