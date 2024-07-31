import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import spline from './src/spline';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10);
camera.position.z = 4;
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// post-processing

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.004;
bloomPass.strength = 1.0;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


// create a tube geometry from the spline
// TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
const tubeGeometry = new THREE.TubeGeometry(spline, 300, 0.7, 16, true);
const tubeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x00fff0,
  side: THREE.DoubleSide,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);

// create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const edgesMaterial = new THREE.LineBasicMaterial({ 
  color: 0x00fff0,
 });
const edgesLine = new THREE.LineSegments(edges, edgesMaterial);
scene.add(edgesLine);

const numBoxes = 69;
const boxSize = 0.1;
const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
for (let i = 0; i < numBoxes; i++) {
  const boxMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00fff0,
    side: THREE.DoubleSide,
    wireframe: false,
  });
  const box = new THREE.Mesh(boxGeo, boxMaterial);
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.y += Math.random() - 0.4;
  box.position.copy(pos);
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  box.rotation.set(rote.x, rote.y, rote.z);
  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ 
    color: 0xddfff0,
  });
  const boxLine = new THREE.LineSegments(edges, lineMat);
  boxLine.position.copy(pos);
  boxLine.rotation.set(rote.x, rote.y, rote.z);
  // scene.add(box); // comment out to hide boxes and just show the box wireframes
  scene.add(boxLine);
}



function updateCamera(t) {
  const time = t * 0.05;
  const looptime = 5 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  const pos2 = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
  camera.position.copy(pos);
  camera.lookAt(pos2);
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  composer.render(scene, camera);
  controls.update();
}

animate();