import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GardenElement } from '../types';
import { INITIAL_CROPS } from '../constants';
import { X, MousePointer2, Footprints, HelpCircle } from 'lucide-react';

interface Garden3DViewProps {
  elements: GardenElement[];
  onClose: () => void;
  width?: number; // Garden width in ft
  height?: number; // Garden height in ft
}

const Garden3DView: React.FC<Garden3DViewProps> = ({ elements, onClose, width = 25, height = 20 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'orbit' | 'walk'>('orbit');
  const [instructions, setInstructions] = useState(true);

  // Refs for cleanup and access
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const pointerControlsRef = useRef<PointerLockControls | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Movement state for walk mode
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, run: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const prevTime = useRef(performance.now());

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB'); // Sky blue
    scene.fog = new THREE.Fog('#87CEEB', 20, 100);
    sceneRef.current = scene;

    // --- 2. Camera ---
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-10, 20, -10); // Start high and offset
    cameraRef.current = camera;

    // --- 3. Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 4. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    // --- 5. Controls ---
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't go below ground
    orbitControls.target.set(width / 2, 0, height / 2);
    orbitControlsRef.current = orbitControls;

    const pointerControls = new PointerLockControls(camera, document.body);
    pointerControlsRef.current = pointerControls;

    // Listeners for First Person Movement
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveState.current.forward = true; break;
        case 'ArrowLeft':
        case 'KeyA': moveState.current.left = true; break;
        case 'ArrowDown':
        case 'KeyS': moveState.current.backward = true; break;
        case 'ArrowRight':
        case 'KeyD': moveState.current.right = true; break;
        case 'ShiftLeft':
        case 'ShiftRight': moveState.current.run = true; break;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveState.current.forward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveState.current.left = false; break;
        case 'ArrowDown':
        case 'KeyS': moveState.current.backward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveState.current.right = false; break;
        case 'ShiftLeft':
        case 'ShiftRight': moveState.current.run = false; break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // --- 6. World Generation (Optimized Resource Cache) ---
    const materials: Record<string, THREE.MeshStandardMaterial | THREE.MeshPhongMaterial> = {};
    const geometries: Record<string, THREE.BufferGeometry> = {
        box: new THREE.BoxGeometry(1, 1, 1),
        cone: new THREE.ConeGeometry(1, 1, 4),
        plane: new THREE.PlaneGeometry(1, 1)
    };

    const getMaterial = (color: string | number, transparent = false, opacity = 1) => {
        const key = `${color}-${transparent}-${opacity}`;
        if (!materials[key]) {
            if (transparent) {
                materials[key] = new THREE.MeshPhongMaterial({ color, transparent, opacity, shininess: 100 });
            } else {
                materials[key] = new THREE.MeshStandardMaterial({ color });
            }
        }
        return materials[key];
    };

    // Helper to create a voxel mesh using shared geometry
    const createBox = (color: string | number, w: number, h: number, d: number, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(geometries.box, getMaterial(color));
        mesh.position.set(x, y, z);
        mesh.scale.set(w, h, d);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    };

    // Helper to create a tree
    const createVoxelTree = (x: number, z: number) => {
        const group = new THREE.Group();
        // Trunk
        group.add(createBox(0x8B4513, 1, 4, 1, 0, 2, 0));
        // Leaves (Bloxy style)
        group.add(createBox(0x228B22, 3, 2, 3, 0, 5, 0));
        group.add(createBox(0x228B22, 2, 1, 2, 0, 6.5, 0));
        group.position.set(x, 0, z);
        return group;
    };

    // Helper to create a plant crop
    const createVoxelPlant = (x: number, z: number, color: string, type: string) => {
        const group = new THREE.Group();
        // Stem
        group.add(createBox(0x556B2F, 0.2, 1, 0.2, 0, 0.5, 0));
        // Foliage/Fruit based on color
        group.add(createBox(color, 0.6, 0.6, 0.6, 0, 1.2, 0));
        
        // Random slight rotation for variety
        group.rotation.y = Math.random() * Math.PI;
        group.position.set(x, 0, z);
        return group;
    };

    // Helper to create a house structure
    const createHouse = (w: number, d: number, x: number, z: number, color: string) => {
        const group = new THREE.Group();
        const wallH = 8;
        // Walls
        group.add(createBox(color, w, wallH, d, 0, wallH/2, 0));
        // Roof
        const roofH = 4;
        const roof = new THREE.Mesh(geometries.cone, getMaterial(0x8B4513));
        // Cone geometry is unit size, need to scale manually to match dimensions
        // Cone default is height 1, radius 1 (width 2)
        const roofRadius = Math.max(w, d) * 0.8;
        roof.scale.set(roofRadius, roofH, roofRadius);
        roof.position.set(0, wallH + roofH/2, 0);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        // Door
        group.add(createBox(0x4A3728, 2, 5, 0.2, 0, 2.5, d/2 + 0.1));

        group.position.set(x, 0, z);
        return group;
    };

    // GROUND
    const groundSize = Math.max(width, height) * 3;
    const ground = new THREE.Mesh(geometries.plane, getMaterial(0x90EE90));
    ground.scale.set(groundSize, groundSize, 1);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // GENERATE ELEMENTS
    elements.forEach(el => {
        const centerX = el.x + el.width / 2;
        const centerZ = el.y + el.height / 2;

        if (el.type === 'structure') {
            if (el.subType === 'house' || el.subType === 'shed' || el.subType === 'garage') {
                scene.add(createHouse(el.width, el.height, centerX, centerZ, el.color || '#e2e8f0'));
            } else if (el.subType === 'path') {
                scene.add(createBox(0xD3D3D3, el.width, 0.1, el.height, centerX, 0.05, centerZ));
            } else if (el.subType === 'fence') {
                scene.add(createBox(0xDEB887, el.width, 3, el.height, centerX, 1.5, centerZ));
            } else if (el.subType === 'basic_tree') {
                scene.add(createVoxelTree(centerX, centerZ));
            }
        } else if (el.type === 'bed') {
            const bedHeight = el.subType === 'raised_bed' ? 2 : 0.5;
            const woodColor = 0x8B4513;
            const dirtColor = 0x3e2b22;
            
            const group = new THREE.Group();
            
            if (el.subType === 'raised_bed') {
                 group.add(createBox(woodColor, el.width, bedHeight, el.height, 0, bedHeight/2, 0));
                 group.add(createBox(dirtColor, el.width - 0.4, 0.1, el.height - 0.4, 0, bedHeight, 0));
            } else if (el.subType === 'ground_bed') {
                 group.add(createBox(dirtColor, el.width, 0.2, el.height, 0, 0.1, 0));
            } else if (el.subType === 'greenhouse') {
                 const glass = new THREE.Mesh(geometries.box, getMaterial(0xADD8E6, true, 0.3));
                 glass.scale.set(el.width, 6, el.height);
                 glass.position.y = 3;
                 glass.castShadow = true;
                 group.add(glass);
                 // Frames using simple boxes
                 const frameMat = getMaterial(0xffffff);
                 const createFrame = (w:number, h:number, d:number, x:number, y:number, z:number) => {
                     const f = new THREE.Mesh(geometries.box, frameMat);
                     f.scale.set(w, h, d);
                     f.position.set(x, y, z);
                     return f;
                 }
                 group.add(createFrame(0.5, 6, 0.5, -el.width/2, 3, -el.height/2));
                 group.add(createFrame(0.5, 6, 0.5, el.width/2, 3, -el.height/2));
                 group.add(createFrame(0.5, 6, 0.5, -el.width/2, 3, el.height/2));
                 group.add(createFrame(0.5, 6, 0.5, el.width/2, 3, el.height/2));
            } else {
                 group.add(createBox(0xcd5c5c, el.width * 0.8, 1.5, el.height * 0.8, 0, 0.75, 0));
            }

            group.position.set(centerX, 0, centerZ);
            scene.add(group);
        } else if (el.type === 'plant') {
            const crop = INITIAL_CROPS.find(c => c.id === el.cropId);
            let hex = 0x228B22; 
            if (crop?.color.includes('red')) hex = 0xff6347;
            if (crop?.color.includes('orange')) hex = 0xffa500;
            if (crop?.color.includes('yellow')) hex = 0xffff00;
            if (crop?.color.includes('purple')) hex = 0x800080;
            if (crop?.color.includes('blue')) hex = 0x4169e1;

            if (crop?.type === 'tree') {
                scene.add(createVoxelTree(centerX, centerZ));
            } else {
                scene.add(createVoxelPlant(centerX, centerZ, '#' + new THREE.Color(hex).getHexString(), crop?.type || 'veg'));
            }
        }
    });

    // --- 7. Animation Loop ---
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const time = performance.now();
      // Clamp delta to prevent huge jumps if tab is inactive
      const delta = Math.min((time - prevTime.current) / 1000, 0.1);

      if (pointerControls.isLocked) {
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
        direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
        direction.current.normalize();

        const speed = moveState.current.run ? 50.0 : 15.0; 

        if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * 100.0 * delta * (speed / 10);
        if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * 100.0 * delta * (speed / 10);

        pointerControls.moveRight(-velocity.current.x * delta);
        pointerControls.moveForward(-velocity.current.z * delta);
      } else {
          orbitControls.update();
      }

      prevTime.current = time;
      renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose resources
      Object.values(materials).forEach(m => m.dispose());
      Object.values(geometries).forEach(g => g.dispose());
      renderer.dispose();
    };
  }, [elements, width, height]);

  const toggleMode = () => {
      if (mode === 'orbit') {
          setMode('walk');
          pointerControlsRef.current?.lock();
          if (cameraRef.current) {
              cameraRef.current.position.set(width/2, 5, height + 10);
              cameraRef.current.lookAt(width/2, 0, height/2);
          }
      } else {
          setMode('orbit');
          pointerControlsRef.current?.unlock();
          if (cameraRef.current) {
              cameraRef.current.position.set(-10, 20, -10);
          }
      }
  };

  useEffect(() => {
      const onUnlock = () => {
          if (mode === 'walk') setMode('orbit');
      };
      pointerControlsRef.current?.addEventListener('unlock', onUnlock);
      return () => {
          pointerControlsRef.current?.removeEventListener('unlock', onUnlock);
      }
  }, [mode]);

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-fadeIn" ref={mountRef}>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 pointer-events-none">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg pointer-events-auto">
              <h2 className="font-bold font-serif text-xl text-stone-800 mb-1">Voxel Garden</h2>
              <p className="text-xs text-stone-500 mb-3">Explore your creation in 3D</p>
              
              <div className="flex gap-2">
                  <button 
                    onClick={toggleMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'orbit' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
                  >
                      <MousePointer2 size={16}/> Orbit View
                  </button>
                  <button 
                    onClick={toggleMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'walk' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
                  >
                      <Footprints size={16}/> First Person
                  </button>
              </div>
          </div>
          
          {instructions && (
             <div className="bg-black/60 backdrop-blur text-white p-4 rounded-xl shadow-lg max-w-xs pointer-events-auto">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm flex items-center gap-2"><HelpCircle size={14}/> Controls</h3>
                    <button onClick={() => setInstructions(false)}><X size={14} /></button>
                 </div>
                 {mode === 'orbit' ? (
                     <ul className="text-xs space-y-1 text-white/80 list-disc pl-4">
                         <li>Left Click + Drag to Rotate</li>
                         <li>Right Click + Drag to Pan</li>
                         <li>Scroll to Zoom</li>
                     </ul>
                 ) : (
                     <ul className="text-xs space-y-1 text-white/80 list-disc pl-4">
                         <li>Mouse to Look</li>
                         <li>W / A / S / D to Walk</li>
                         <li>Shift to Run</li>
                         <li>ESC to exit First Person</li>
                     </ul>
                 )}
             </div>
          )}
      </div>

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-colors pointer-events-auto"
      >
          <X size={24} />
      </button>
    </div>
  );
};

export default Garden3DView;
