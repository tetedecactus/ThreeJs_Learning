// Texture -> https://www.solarsystemscope.com/textures/
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
// 12. Load a texture
// 13. Add Material on this Geometry
// 14. Set up Mesh -> Mesh(geometry, material)
// 15. Add the mesh to the scene
// 16. Need to add light to the black side of the earth
// 17. Need to add Clouds
// 18. Add fresnel effect to the earth
// 19. Add stars to the scene
// 20. Need to add light to use the MeshStandardMaterial
// 21. Animation Loop -> make it turn on itself
// 22. requestAnimationFrame(callback) -> callback is the function to be called
// 23. Update the controls to move the camera around the object
// 24. Render the scene -> render(scene, camera)
// 25. Update the camera aspect ratio when the window is resized
// 26. Add an event listener to the window to handle the resize event
// 27. Call the handleWindowResize function when the window is resized
// 28. Add the event listener to the window


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getFresnelMat } from './src/getFresnelMat';
import getStarfield from './src/getStarfield';

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
camera.position.z = 4
// Create a scene
const scene = new THREE.Scene();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
// Add earthGroup to the scene -> to make the earth turn on itself with the right axis
const earthGroup = new THREE.Group();
earthGroup.rotation.y = -23.4 * Math.PI / 180;
scene.add(earthGroup);
// Add OrbitControls to the scene
const controls = new OrbitControls(camera, renderer.domElement);
//  Add damping to the controls -> controls.enableDamping = true -> to make the camera move smoothly
controls.enableDamping = true;
// Add factor to the damping -> controls.dampingFactor = 0.25 -> to make the camera move smoothly
controls.dampingFactor = 0.25;
// IcosahedronGeometry(radius, detail) -> detail is the number of times the geometry is subdivided 
// The higher the detail, the more the geometry is subdivided -> more the geometry is smooth
const geo = new THREE.IcosahedronGeometry(1,  25);
// Load a texture
// https://threejs.org/docs/#api/en/textures/Texture
const loader = new THREE.TextureLoader();
// Add Material on this Geometry
// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial.aoMapIntensity
const mat = new THREE.MeshPhongMaterial({ 
  // import the texture as a map
  map: loader.load('./earthmap1k.jpg'),
  specularMap: loader.load("./earthspec1k.jpg"),
  bumpMap: loader.load("./earthbump1k.jpg"),
  bumpScale: 0.04,
});
// Set up Mesh -> Mesh(geometry, material)
// Mesh is an object that takes a geometry, and applies a material to it
const earthMesh = new THREE.Mesh(geo, mat); 
// Add the mesh to the scene
earthGroup.add(earthMesh);
// Need to add light to the black side of the earth
const lightMat= new THREE.MeshBasicMaterial({
  map: loader.load('./earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
})
const lightMesh = new THREE.Mesh(geo, lightMat);
lightMesh.scale.setScalar(1.000002);
earthGroup.add(lightMesh);
// Need to add Clouds
const cloudMat = new THREE.MeshStandardMaterial({
  map: loader.load('./earthcloudmap.jpg'),
  // transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./earthcloudmaptrans.jpg'),
});
const cloudMesh = new THREE.Mesh(geo, cloudMat);
cloudMesh.scale.setScalar(1.03);
earthGroup.add(cloudMesh);
// Add fresnel effect to the earth
const fresnelMat = getFresnelMat();
const fresnelMesh = new THREE.Mesh(geo, fresnelMat);
fresnelMesh.scale.setScalar(1.003);
earthGroup.add(fresnelMesh);
// Add stars to the scene
const stars = getStarfield({numStars: 2500});
stars.scale.setScalar(0.1);
scene.add(stars);
// Add light to use the MeshStandardMaterial
const sunColor = 0xffffffff;
const sunLight = new THREE.DirectionalLight(sunColor, 2);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);
// Animation Loop -> make it turn on itself
function animate() {
  // requestAnimationFrame(callback) -> callback is the function to be called
  // This function tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.0022;
  lightMesh.rotation.y += 0.0022;
  cloudMesh.rotation.y += 0.0022;
  fresnelMesh.rotation.y += 0.0022;
  stars.rotation.y += 0.0005;
  renderer.render(scene, camera);
  // Update the controls to move the camera around the object
  controls.update();
} 
animate();
// Render the scene -> render(scene, camera) Render must be called every time the scene changes
renderer.render(scene, camera);
function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);