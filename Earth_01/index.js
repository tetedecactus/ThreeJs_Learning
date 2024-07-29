// Step by step guide to create Earth reproduction with Three.js
// 1. import necessary modules
// 2. Grab height and width of the window
// 3. Create a renderer to render the scene
// 4. Append the renderer to the body of the document
// 5. Set up Camera -> Camera(fov, aspect ratio, near, far)
// 6. Set the position of the camera, more the z value is, more the camera is far from the object
// 7. Create a scene
// 8. Add OrbitControls to the scene
// 9. Add damping to the controls -> controls.enableDamping = true -> to make the camera move smoothly
// 10. Add factor to the damping -> controls.dampingFactor = 0.25 -> to make the camera move smoothly
// 11. IcosahedronGeometry(radius, detail) -> detail is the number of times the geometry is subdivided
// 12. Load a texture -> loader.load('./public/earthmap1k.jpg')
// 13. Add Material on this Geometry -> MeshStandardMaterial({ map: loader.load('./public/earthmap1k.jpg') }) -> we use MeshStandardMaterial to use the texture
// 14. Set up Mesh -> Mesh(geometry, material) -> Mesh is an object that takes a geometry, and applies a material to it
// 15. Add the mesh to the scene
// 16. Need to add light to use the MeshStandardMaterial -> HemisphereLight(skyColor, groundColor, intensity)
// 17. Animation Loop -> make it turn on itself
// 18. requestAnimationFrame(callback) -> callback is the function to be called
// 19. mesh.rotation.y += 0.001; -> make the mesh turn on itself
// 20. renderer.render(scene, camera); -> Render must be called every time the scene changes
// 21. Update the controls to move the camera around the object -> controls.update();
// 22. animate(); -> call the animate function



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

// Set the position of the camera, more the z value is, more the camera is far from the object
camera.position.z = 3

// Create a scene
const scene = new THREE.Scene();

// Add OrbitControls to the scene
const controls = new OrbitControls(camera, renderer.domElement);

//  Add damping to the controls -> controls.enableDamping = true -> to make the camera move smoothly
controls.enableDamping = true;

// Add factor to the damping -> controls.dampingFactor = 0.25 -> to make the camera move smoothly
controls.dampingFactor = 0.25;

// IcosahedronGeometry(radius, detail) -> detail is the number of times the geometry is subdivided 
// The higher the detail, the more the geometry is subdivided -> more the geometry is smooth
const geo = new THREE.IcosahedronGeometry(1.0,  14);

// Load a texture
// https://threejs.org/docs/#api/en/textures/Texture
const loader = new THREE.TextureLoader();

// Add Material on this Geometry
// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial.aoMapIntensity
const mat = new THREE.MeshStandardMaterial({ 
  // import the texture as a map
  map: loader.load('./earthlights1k.jpg'),
  map: loader.load('./earthmap1k.jpg'),
});

// Set up Mesh -> Mesh(geometry, material)
// Mesh is an object that takes a geometry, and applies a material to it
const mesh = new THREE.Mesh(geo, mat); 

// Add the mesh to the scene
scene.add(mesh);

// Need to add light to use the MeshStandardMaterial
const skyColor = 0xffffff;
const groundColor = 0x444444;
const intensity = 5;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

// Animation Loop -> make it turn on itself
function animate() {
  // requestAnimationFrame(callback) -> callback is the function to be called
  // This function tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
  requestAnimationFrame(animate);
  // mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  // mesh.rotation.z += 0.001;
  renderer.render(scene, camera);
  // Update the controls to move the camera around the object
  controls.update();
} 

animate();

// Render the scene -> render(scene, camera) Render must be called every time the scene changes
renderer.render(scene, camera);