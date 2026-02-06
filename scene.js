// ============================================
// MAISON — Cartier-Style 3D Gallery v2
// ============================================

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// Scene Setup
// ============================================
const scene = new THREE.Scene();

// Warm beige background (Cartier palette)
scene.background = new THREE.Color(0xc9a88a);
scene.fog = new THREE.FogExp2(0xc9a88a, 0.01);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 4, 30);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ============================================
// Post-Processing Pipeline (CARTIER GLOW)
// ============================================
const composer = new EffectComposer(renderer);

// Main render pass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom for soft glow
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.4,    // strength
  0.6,    // radius  
  0.85    // threshold
);
composer.addPass(bloomPass);

// Vignette shader
const VignetteShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'offset': { value: 0.9 },
    'darkness': { value: 1.2 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
      float vignette = clamp(1.0 - dot(uv, uv), 0.0, 1.0);
      vignette = pow(vignette, darkness);
      texel.rgb *= vignette;
      gl_FragColor = texel;
    }
  `
};

const vignettePass = new ShaderPass(VignetteShader);
composer.addPass(vignettePass);

// ============================================
// Lighting — Soft, warm, luxurious (CARTIER-STYLE)
// ============================================

// Ambient fill (increased for softer shadows)
const ambientLight = new THREE.AmbientLight(0xf5e8d8, 0.7);
scene.add(ambientLight);

// Main directional (soft skylight)
const mainLight = new THREE.DirectionalLight(0xfffaf0, 0.6);
mainLight.position.set(15, 35, 25);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.far = 150;
mainLight.shadow.camera.left = -50;
mainLight.shadow.camera.right = 50;
mainLight.shadow.camera.top = 50;
mainLight.shadow.camera.bottom = -50;
mainLight.shadow.bias = -0.0005;
mainLight.shadow.radius = 3; // Softer shadows
scene.add(mainLight);

// Warm fill light from side
const fillLight1 = new THREE.DirectionalLight(0xffe8d4, 0.35);
fillLight1.position.set(-15, 8, -15);
scene.add(fillLight1);

// Secondary fill from opposite side
const fillLight2 = new THREE.DirectionalLight(0xfff0e0, 0.25);
fillLight2.position.set(12, 6, 10);
scene.add(fillLight2);

// Hemisphere light for natural sky/ground blend
const hemiLight = new THREE.HemisphereLight(0xfff5e8, 0xc9a88a, 0.5);
scene.add(hemiLight);

// Subtle point light for depth
const accentLight = new THREE.PointLight(0xfff8e8, 0.4, 50);
accentLight.position.set(0, 8, -50);
scene.add(accentLight);

// ============================================
// Materials — Cartier palette (REFINED)
// ============================================
const materials = {
  floor: new THREE.MeshStandardMaterial({ 
    color: 0xb5a08d,
    roughness: 0.88,
    metalness: 0.02,
    envMapIntensity: 0.3
  }),
  wall: new THREE.MeshStandardMaterial({ 
    color: 0xcfc2b0,
    roughness: 0.92,
    metalness: 0.01,
    envMapIntensity: 0.2
  }),
  ceiling: new THREE.MeshStandardMaterial({ 
    color: 0xe2d8c8,
    roughness: 0.95,
    metalness: 0.0,
    envMapIntensity: 0.1
  }),
  pillar: new THREE.MeshStandardMaterial({ 
    color: 0xd8cbb8,
    roughness: 0.75,
    metalness: 0.05,
    envMapIntensity: 0.4
  }),
  gold: new THREE.MeshStandardMaterial({ 
    color: 0xe0b840,
    roughness: 0.25,
    metalness: 0.85,
    envMapIntensity: 1.2,
    emissive: 0xe0b840,
    emissiveIntensity: 0.1
  }),
  accent: new THREE.MeshStandardMaterial({ 
    color: 0xf2e4c8,
    roughness: 0.35,
    metalness: 0.65,
    envMapIntensity: 0.8,
    emissive: 0xf2e4c8,
    emissiveIntensity: 0.08
  })
};

// ============================================
// Architecture — Rooms & Corridors (CURVED ORGANIC)
// ============================================

function createRoom(zStart, roomLength = 40, roomWidth = 20, roomHeight = 12) {
  const group = new THREE.Group();
  
  // Floor
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength, 20, 20);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, zStart - roomLength/2);
  floor.receiveShadow = true;
  group.add(floor);
  
  // Ceiling (slightly curved for organic feel)
  const ceilingGeo = new THREE.PlaneGeometry(roomWidth, roomLength, 20, 20);
  const ceilingPositions = ceilingGeo.attributes.position;
  for (let i = 0; i < ceilingPositions.count; i++) {
    const x = ceilingPositions.getX(i);
    const z = ceilingPositions.getZ(i);
    // Gentle dome curve
    const curve = -0.3 * (Math.pow(x / (roomWidth/2), 2) + Math.pow(z / (roomLength/2), 2));
    ceilingPositions.setY(i, curve);
  }
  ceilingGeo.computeVertexNormals();
  const ceiling = new THREE.Mesh(ceilingGeo, materials.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, roomHeight, zStart - roomLength/2);
  group.add(ceiling);
  
  // CURVED LEFT WALL (using cylinder segment)
  const wallCurve = 0.3; // How much the wall curves inward
  const leftWallGeo = new THREE.CylinderGeometry(
    roomWidth/2 + wallCurve * roomWidth, // top radius
    roomWidth/2 + wallCurve * roomWidth, // bottom radius
    roomHeight,
    32,
    1,
    true,
    Math.PI * 0.35, // start angle
    Math.PI * 0.3  // sweep angle
  );
  const leftWall = new THREE.Mesh(leftWallGeo, materials.wall);
  leftWall.position.set(-roomWidth/2 - wallCurve * roomWidth/2, roomHeight/2, zStart - roomLength/2);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  group.add(leftWall);
  
  // CURVED RIGHT WALL
  const rightWallGeo = new THREE.CylinderGeometry(
    roomWidth/2 + wallCurve * roomWidth,
    roomWidth/2 + wallCurve * roomWidth,
    roomHeight,
    32,
    1,
    true,
    Math.PI * 1.35,
    Math.PI * 0.3
  );
  const rightWall = new THREE.Mesh(rightWallGeo, materials.wall);
  rightWall.position.set(roomWidth/2 + wallCurve * roomWidth/2, roomHeight/2, zStart - roomLength/2);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  group.add(rightWall);
  
  // ROUNDED CORNER ACCENTS (softens the space)
  const cornerRadius = 1.5;
  const cornerGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, roomHeight, 16);
  
  // Front-left corner
  const cornerFL = new THREE.Mesh(cornerGeo, materials.wall);
  cornerFL.position.set(-roomWidth/2 + cornerRadius, roomHeight/2, zStart + cornerRadius);
  group.add(cornerFL);
  
  // Front-right corner
  const cornerFR = new THREE.Mesh(cornerGeo, materials.wall);
  cornerFR.position.set(roomWidth/2 - cornerRadius, roomHeight/2, zStart + cornerRadius);
  group.add(cornerFR);
  
  // Back-left corner
  const cornerBL = new THREE.Mesh(cornerGeo, materials.wall);
  cornerBL.position.set(-roomWidth/2 + cornerRadius, roomHeight/2, zStart - roomLength + cornerRadius);
  group.add(cornerBL);
  
  // Back-right corner
  const cornerBR = new THREE.Mesh(cornerGeo, materials.wall);
  cornerBR.position.set(roomWidth/2 - cornerRadius, roomHeight/2, zStart - roomLength + cornerRadius);
  group.add(cornerBR);
  
  return group;
}

// Create connected rooms
const rooms = [];
let currentZ = 30;

for (let i = 0; i < 5; i++) {
  const room = createRoom(currentZ, 50, 24, 14);
  rooms.push(room);
  scene.add(room);
  currentZ -= 50;
}

// ============================================
// Arched Doorways (Cartier signature - ENHANCED)
// ============================================

function createArchedDoorway(z, width = 7, height = 11) {
  const group = new THREE.Group();
  
  // Doorway frame (thicker, more substantial)
  const frameThickness = 1.2;
  const frameDepth = 2.5; // Depth of the archway
  const archRadius = width / 2;
  
  // Left pillar (rounded cylinder instead of box)
  const pillarGeo = new THREE.CylinderGeometry(
    frameThickness * 0.5,
    frameThickness * 0.6,
    height - archRadius,
    24
  );
  const leftPillar = new THREE.Mesh(pillarGeo, materials.pillar);
  leftPillar.position.set(-width/2, (height - archRadius)/2, z);
  leftPillar.castShadow = true;
  group.add(leftPillar);
  
  // Right pillar
  const rightPillar = new THREE.Mesh(pillarGeo, materials.pillar);
  rightPillar.position.set(width/2, (height - archRadius)/2, z);
  rightPillar.castShadow = true;
  group.add(rightPillar);
  
  // Main arch (using torus segment with more detail)
  const archGeo = new THREE.TorusGeometry(
    archRadius,
    frameThickness * 0.5,
    16,
    48,
    Math.PI
  );
  const arch = new THREE.Mesh(archGeo, materials.pillar);
  arch.rotation.x = Math.PI / 2;
  arch.rotation.z = Math.PI / 2;
  arch.position.set(0, height - archRadius, z);
  arch.castShadow = true;
  group.add(arch);
  
  // Inner archway depth (creates recessed effect)
  const innerArchGeo = new THREE.TorusGeometry(
    archRadius - frameThickness,
    frameThickness * 0.3,
    12,
    36,
    Math.PI
  );
  const innerArch = new THREE.Mesh(innerArchGeo, materials.wall);
  innerArch.rotation.x = Math.PI / 2;
  innerArch.rotation.z = Math.PI / 2;
  innerArch.position.set(0, height - archRadius, z - frameDepth * 0.5);
  group.add(innerArch);
  
  // Archway back wall (curved surface)
  const backWallGeo = new THREE.CylinderGeometry(
    archRadius * 0.8,
    archRadius * 0.9,
    height * 0.9,
    32,
    1,
    true,
    0,
    Math.PI
  );
  const backWall = new THREE.Mesh(backWallGeo, materials.wall);
  backWall.rotation.y = Math.PI / 2;
  backWall.position.set(0, height * 0.45, z - frameDepth);
  backWall.receiveShadow = true;
  group.add(backWall);
  
  // Subtle rim light effect on arch edges
  const rimLightGeo = new THREE.TorusGeometry(
    archRadius + 0.1,
    0.1,
    8,
    32,
    Math.PI
  );
  const rimLight = new THREE.Mesh(
    rimLightGeo,
    new THREE.MeshBasicMaterial({ 
      color: 0xfff5e6, 
      transparent: true, 
      opacity: 0.3 
    })
  );
  rimLight.rotation.x = Math.PI / 2;
  rimLight.rotation.z = Math.PI / 2;
  rimLight.position.set(0, height - archRadius, z + 0.1);
  group.add(rimLight);
  
  return group;
}

// Place doorways between rooms
const doorways = [];
for (let i = 0; i < 4; i++) {
  const doorway = createArchedDoorway(5 - i * 50, 7, 11);
  doorways.push(doorway);
  scene.add(doorway);
}

// ============================================
// Floating Exhibition Pieces
// ============================================

const exhibits = [];

// Golden torus (ring)
const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 32, 64);
const torus = new THREE.Mesh(torusGeo, materials.gold);
torus.position.set(0, 5, 0);
torus.castShadow = true;
exhibits.push(torus);
scene.add(torus);

// Geometric sculpture 1
const dodecaGeo = new THREE.DodecahedronGeometry(1.2, 0);
const dodeca = new THREE.Mesh(dodecaGeo, materials.accent);
dodeca.position.set(3, 4.5, -45);
dodeca.castShadow = true;
exhibits.push(dodeca);
scene.add(dodeca);

// Geometric sculpture 2
const icosaGeo = new THREE.IcosahedronGeometry(1, 0);
const icosa = new THREE.Mesh(icosaGeo, materials.gold);
icosa.position.set(-3, 5.5, -95);
icosa.castShadow = true;
exhibits.push(icosa);
scene.add(icosa);

// Floating sphere
const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
const sphere = new THREE.Mesh(sphereGeo, materials.accent);
sphere.position.set(0, 6, -145);
sphere.castShadow = true;
exhibits.push(sphere);
scene.add(sphere);

// Octahedron
const octaGeo = new THREE.OctahedronGeometry(1.3, 0);
const octa = new THREE.Mesh(octaGeo, materials.gold);
octa.position.set(2, 5, -195);
octa.castShadow = true;
exhibits.push(octa);
scene.add(octa);

// ============================================
// Decorative Pillars
// ============================================

function createPillar(x, z) {
  const group = new THREE.Group();
  
  // Main shaft
  const shaftGeo = new THREE.CylinderGeometry(0.4, 0.5, 10, 16);
  const shaft = new THREE.Mesh(shaftGeo, materials.pillar);
  shaft.position.set(x, 5, z);
  shaft.castShadow = true;
  group.add(shaft);
  
  // Base
  const baseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.6, 16);
  const base = new THREE.Mesh(baseGeo, materials.pillar);
  base.position.set(x, 0.3, z);
  group.add(base);
  
  // Capital
  const capitalGeo = new THREE.CylinderGeometry(0.8, 0.5, 0.5, 16);
  const capital = new THREE.Mesh(capitalGeo, materials.pillar);
  capital.position.set(x, 10.2, z);
  group.add(capital);
  
  return group;
}

// Add pillars along the gallery
for (let i = 0; i < 5; i++) {
  const z = 15 - i * 50;
  scene.add(createPillar(-9, z));
  scene.add(createPillar(9, z));
  scene.add(createPillar(-9, z - 25));
  scene.add(createPillar(9, z - 25));
}

// ============================================
// Atmospheric Particles (Dust motes - ENHANCED)
// ============================================

const particleCount = 1200;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 30;
  positions[i * 3 + 1] = Math.random() * 14;
  positions[i * 3 + 2] = Math.random() * -250 + 30;
  
  // Varied particle sizes (larger and more visible)
  sizes[i] = Math.random() * 0.15 + 0.12;
  
  velocities.push({
    x: (Math.random() - 0.5) * 0.008,
    y: (Math.random() - 0.5) * 0.004,
    z: (Math.random() - 0.5) * 0.008
  });
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Custom shader for glowing particles
const particleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0xfff5e6) },
    pointTexture: { value: createParticleTexture() }
  },
  vertexShader: `
    attribute float size;
    varying vec3 vColor;
    
    void main() {
      vColor = vec3(1.0, 0.96, 0.9);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    varying vec3 vColor;
    
    void main() {
      vec4 texColor = texture2D(pointTexture, gl_PointCoord);
      gl_FragColor = vec4(vColor, 1.0) * texColor;
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Create soft circular particle texture
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 250, 230, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 245, 220, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 240, 210, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================
// Camera Path (Scroll-driven)
// ============================================

const cameraPath = {
  startZ: 30,
  endZ: -200,
  startY: 4,
  endY: 5
};

// ============================================
// Scroll Animation (SMOOTH CARTIER-STYLE)
// ============================================

// Custom easing function (power2.inOut equivalent)
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Smooth interpolation with easing
function smoothLerp(start, end, progress, easing = true) {
  const t = easing ? easeInOutQuad(progress) : progress;
  return start + (end - start) * t;
}

ScrollTrigger.create({
  trigger: '.scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 2, // Increased for smoother feel
  onUpdate: (self) => {
    const progress = self.progress;
    
    // Camera Z movement (walking forward) with smooth easing
    camera.position.z = smoothLerp(
      cameraPath.startZ,
      cameraPath.endZ,
      progress,
      true
    );
    
    // Gentle floating Y movement
    const yWave = Math.sin(progress * Math.PI * 3) * 0.3;
    camera.position.y = smoothLerp(
      cameraPath.startY,
      cameraPath.endY,
      progress,
      true
    ) + yWave;
    
    // Very subtle camera sway (reduced)
    camera.position.x = Math.sin(progress * Math.PI * 2.5) * 0.3;
    
    // Camera look-at (look slightly ahead)
    const lookAheadZ = camera.position.z - 10;
    const lookAtY = 5 + Math.sin(progress * Math.PI) * 0.5;
    camera.lookAt(0, lookAtY, lookAheadZ);
    
    // Update progress bar
    document.getElementById('progress').style.width = (progress * 100) + '%';
  }
});

// ============================================
// Animation Loop
// ============================================

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  
  // Animate floating exhibits
  exhibits.forEach((exhibit, i) => {
    exhibit.rotation.y += 0.003;
    exhibit.rotation.x = Math.sin(time + i) * 0.1;
    exhibit.position.y += Math.sin(time * 0.5 + i * 2) * 0.002;
  });
  
  // Animate particles
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;
    
    // Bounds check
    if (positions[i * 3] > 15) positions[i * 3] = -15;
    if (positions[i * 3] < -15) positions[i * 3] = 15;
    if (positions[i * 3 + 1] > 14) positions[i * 3 + 1] = 0;
    if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 14;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  
  // Render with post-processing
  composer.render();
}

// ============================================
// Resize Handler
// ============================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// Loading
// ============================================

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loading').classList.add('hidden');
  }, 2200);
});

// Start
animate();
