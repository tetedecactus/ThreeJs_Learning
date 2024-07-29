// Step by step guide to create a 3D object using Three.js
// 1. Import the necessary modules from Three.js
// 2. Grab the height and width of the window
// 3. Create a renderer to render the scene -> like canvas
// 4. Append the renderer to the body of the document
// 5. Set up the camera -> Camera(fov, aspect ratio, near, far)
// 6. Create a scene
// 7. Create a geometry -> IcosahedronGeometry(radius, detail)
// 8. Add a material on this geometry
// 9. Set up a mesh -> Mesh(geometry, material)
// 10. Add the mesh to the scene -> scene.add(mesh)
// 11. Add wireframe to the mesh
// 12. Add light to the scene -> COULD NOT USE MeshStandardMaterial without light
// 13. Create an animation loop -> make the mesh turn on itself
// 14. Call the animate function
// 15. Render the scene -> render(scene, camera)
// 16. Add OrbitControls to the scene -> to move the camera around the object
// 17. import OrbitControls from 'three-orbitcontrols'
// 18. Add damping to the controls -> controls.enableDamping = true -> to make the camera move smoothly
// 19. Add factor to the damping -> controls.dampingFactor = 0.25 -> to make the camera move smoothly
// 20. Update the controls -> controls.update() -> to move the camera around the object in your animation function
// 21. Done !!


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Grab height and width of the window
const w = window.innerWidth;
const h = window.innerHeight;

// Renderer to render the scene
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

// Append the renderer to the body of the document
document.body.appendChild(renderer.domElement);

//  Set up Camera -> Camera(fov, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10);

camera.position.z = 2

// Create a scene
const scene = new THREE.Scene();

// Add OrbitControls to the scene
const controls = new OrbitControls(camera, renderer.domElement);

//  Add damping to the controls -> controls.enableDamping = true -> to make the camera move smoothly
controls.enableDamping = true;

// Add factor to the damping -> controls.dampingFactor = 0.25 -> to make the camera move smoothly
controls.dampingFactor = 0.25;

// IcosahedronGeometry(radius, detail) -> detail is the number of times the geometry is subdivided 
const geo = new THREE.IcosahedronGeometry(1.0,  2);

// Add Material on this Geometry
// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial.aoMapIntensity
const mat = new THREE.MeshStandardMaterial({ 
  color: 0xffffff,
  flatShading: true
});

// Set up Mesh -> Mesh(geometry, material)
// Mesh is an object that takes a geometry, and applies a material to it
const mesh = new THREE.Mesh(geo, mat); 

// Add the mesh to the scene
scene.add(mesh);

// Add Wire Mesh

// New material for wireframe
const wireframe = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
  // transparent: true
});

const wireMesh = new THREE.Mesh(geo, wireframe);
// Scale the wireframe a bit to make it bigger than the mesh
// wireMesh.scale.set(1.01, 1.001, 1.01);
wireMesh.scale.setScalar(1.001);
// Add the wireframe to the scene as child of mesh to make it rotate, and not the scene -> scene.add(wireMesh)
mesh.add(wireMesh);

// Need to add light to use the MeshStandardMaterial
const skyColor = 0x0099ff;
const groundColor = 0xaa5500;
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

// Animation Loop -> make it turn on itself
function animate() {
  // requestAnimationFrame(callback) -> callback is the function to be called
  // This function tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  mesh.rotation.z += 0.001;
  renderer.render(scene, camera);
  // Update the controls to move the camera around the object
  controls.update();
} 

animate();
// Render the scene -> render(scene, camera) Render must be called every time the scene changes
renderer.render(scene, camera);