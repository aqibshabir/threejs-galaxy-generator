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

// Galaxy
const parameters = {
  count: 100000,
  size: 0.01
}

// Galaxy variables
let particleGeometry = null
let particleMaterial = null
let points = null


const generateGalaxy = () => {
  // Disposing Of Previous Galaxy
  if(points !== null) {
    particleGeometry.dispose()
    particleMaterial.dispose()
    scene.remove(points)
  }

  // Geometry
  particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  
  // Random Positions
  for(let i = 0; i < parameters.count * 3; i++){
    // Axis Variables
    const x = i * 3
    const y = x + 1
    const z = y + 1

    positions[x] = (Math.random() - 0.5) * 3
    positions[y] = (Math.random() - 0.5) * 3
    positions[z] = (Math.random() - 0.5) * 3
  }

  // Setting Position Attribute For X,Y,Z
  particleGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
  )

  // Material
  particleMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  // Points
  points = new THREE.Points(
    particleGeometry, particleMaterial
  )

  scene.add(points)

}
generateGalaxy()

// Parameter Tweaks
gui.add(parameters, 'count').min(10).max(10000).step(10).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.01).max(0.1).step(0.01).onFinishChange(generateGalaxy)

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