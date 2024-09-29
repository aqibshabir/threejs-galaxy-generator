import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

// Creating Canvas
const createCanvas = document.createElement('canvas')
createCanvas.classList.add('webgl')
document.body.prepend(createCanvas)

// Canvas Selector Variable 
const canvas = document.querySelector('canvas.webgl')

// Tweaks GUI
const gui = new GUI()

// Scene
const scene = new THREE.Scene()

// Test Cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial()
)
scene.add(cube)

// Window Size
const size = {
  height: window.innerHeight,
  width: window.innerWidth
}

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)

// Updating Screen Size
window.addEventListener('resize', () => {
  // updating height/width/aspect
  size.height = window.innerHeight
  size.width = window.innerWidth
  camera.aspect = size.width / size.height
  // updating matrix
  camera.updateProjectionMatrix()
  // reflecting new size onto renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)
  renderer.render(scene, camera)
})

// Orbit Controls
const controls = new OrbitControls(camera, canvas)

// Animating Function
const animate = () => {
  // Orbit Controls
  controls.update()
  controls.enableDamping = true

  // Rendering Scene
  renderer.render(scene, camera)

  // Performs Animation
  window.requestAnimationFrame(animate)
}
animate()