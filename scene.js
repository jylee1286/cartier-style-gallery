// ============================================
// MAISON — Cartier-Style 3D Gallery
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ============================================
// Scene Setup
// ============================================
const scene = new THREE.Scene();

// Warm beige background (Cartier palette)
scene.background = new THREE.Color(0xc4b5a0);
scene.fog = new THREE.FogExp2(0xc4b5a0, 0.012);

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
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ============================================
// Lighting — Soft, warm, luxurious
// ============================================

// Ambient fill
const ambientLight = new THREE.AmbientLight(0xf5e6d3, 0.6);
scene.add(ambientLight);

// Main directional (sun through skylights)
const mainLight = new THREE.DirectionalLight(0xfff8e8, 0.8);
mainLight.position.set(10, 30, 20);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.far = 100;
mainLight.shadow.camera.left = -40;
mainLight.shadow.camera.right = 40;
mainLight.shadow.camera.top = 40;
mainLight.shadow.camera.bottom = -40;
mainLight.shadow.bias = -0.001;
scene.add(mainLight);

// Warm fill light from below
const fillLight = new THREE.DirectionalLight(0xffe4c4, 0.3);
fillLight.position.set(-10, 5, -10);
scene.add(fillLight);

// Hemisphere light for natural sky/ground blend
const hemiLight = new THREE.HemisphereLight(0xffeedd, 0xc4b5a0, 0.4);
scene.add(hemiLight);

// ============================================
// Materials — Cartier palette
// ============================================
const materials = {
  floor: new THREE.MeshStandardMaterial({ 
    color: 0xb8a890,
    roughness: 0.85,
    metalness: 0.05
  }),
  wall: new THREE.MeshStandardMaterial({ 
    color: 0xd4c8b8,
    roughness: 0.9,
    metalness: 0.02
  }),
  ceiling: new THREE.MeshStandardMaterial({ 
    color: 0xe8dfd0,
    roughness: 0.95,
    metalness: 0.0
  }),
  pillar: new THREE.MeshStandardMaterial({ 
    color: 0xddd2c2,
    roughness: 0.7,
    metalness: 0.05
  }),
  gold: new THREE.MeshStandardMaterial({ 
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.8
  }),
  accent: new THREE.MeshStandardMaterial({ 
    color: 0xf5e6c8,
    roughness: 0.4,
    metalness: 0.6
  })
};

// ============================================
// Architecture — Rooms & Corridors
// ============================================

function createRoom(zStart, roomLength = 40, roomWidth = 20, roomHeight = 12) {
  const group = new THREE.Group();
  
  // Floor
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, zStart - roomLength/2);
  floor.receiveShadow = true;
  group.add(floor);
  
  // Ceiling
  const ceiling = new THREE.Mesh(floorGeo, materials.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, roomHeight, zStart - roomLength/2);
  group.add(ceiling);
  
  // Left wall
  const wallGeo = new THREE.PlaneGeometry(roomLength, roomHeight);
  const leftWall = new THREE.Mesh(wallGeo, materials.wall);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-roomWidth/2, roomHeight/2, zStart - roomLength/2);
  leftWall.receiveShadow = true;
  group.add(leftWall);
  
  // Right wall
  const rightWall = new THREE.Mesh(wallGeo, materials.wall);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(roomWidth/2, roomHeight/2, zStart - roomLength/2);
  rightWall.receiveShadow = true;
  group.add(rightWall);
  
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
// Arched Doorways (Cartier signature)
// ============================================

function createArchedDoorway(z, width = 6, height = 10) {
  const group = new THREE.Group();
  
  // Doorway frame
  const frameThickness = 0.8;
  const archRadius = width / 2;
  
  // Left pillar
  const pillarGeo = new THREE.BoxGeometry(frameThickness, height - archRadius, frameThickness);
  const leftPillar = new THREE.Mesh(pillarGeo, materials.pillar);
  leftPillar.position.set(-width/2, (height - archRadius)/2, z);
  leftPillar.castShadow = true;
  group.add(leftPillar);
  
  // Right pillar
  const rightPillar = new THREE.Mesh(pillarGeo, materials.pillar);
  rightPillar.position.set(width/2, (height - archRadius)/2, z);
  rightPillar.castShadow = true;
  group.add(rightPillar);
  
  // Arch (using torus segment)
  const archGeo = new THREE.TorusGeometry(archRadius, frameThickness/2, 8, 16, Math.PI);
  const arch = new THREE.Mesh(archGeo, materials.pillar);
  arch.rotation.x = Math.PI / 2;
  arch.rotation.z = Math.PI / 2;
  arch.position.set(0, height - archRadius, z);
  arch.castShadow = true;
  group.add(arch);
  
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
// Atmospheric Particles (Dust motes)
// ============================================

const particleCount = 800;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 30;
  positions[i * 3 + 1] = Math.random() * 14;
  positions[i * 3 + 2] = Math.random() * -250 + 30;
  
  velocities.push({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.005,
    z: (Math.random() - 0.5) * 0.01
  });
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xfff8e0,
  size: 0.08,
  transparent: true,
  opacity: 0.6,
  sizeAttenuation: true
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

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
// Scroll Animation
// ============================================

ScrollTrigger.create({
  trigger: '.scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.5,
  onUpdate: (self) => {
    const progress = self.progress;
    
    // Camera Z movement (walking forward)
    camera.position.z = THREE.MathUtils.lerp(
      cameraPath.startZ,
      cameraPath.endZ,
      progress
    );
    
    // Slight Y movement
    camera.position.y = THREE.MathUtils.lerp(
      cameraPath.startY,
      cameraPath.endY,
      Math.sin(progress * Math.PI) * 0.5 + progress * 0.5
    );
    
    // Subtle camera sway
    camera.position.x = Math.sin(progress * Math.PI * 2) * 0.5;
    
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
  
  renderer.render(scene, camera);
}

// ============================================
// Resize Handler
// ============================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
