import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {Timer} from 'three/addons/misc/Timer.js'

// Creating Canvas
const createCanvas = document.createElement('canvas')
createCanvas.classList.add('webgl')
document.body.prepend(createCanvas)

// Canvas Selector Variable 
const canvas = document.querySelector('canvas.webgl')

// Tweaks GUI
const gui = new GUI({
  title: 'Generate Galaxy',
})

gui.close()

// Scene
const scene = new THREE.Scene()

// Galaxy
const parameters = {
  count: 50000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.02,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
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
  const colors = new Float32Array(parameters.count * 3)

  const insideColor = new THREE.Color(parameters.insideColor)
  const outsideColor = new THREE.Color(parameters.outsideColor)
  
  // Random Positions
  for(let i = 0; i < parameters.count * 3; i++){

    // Axis Variables
    const x = i * 3
    const y = x + 1
    const z = y + 1

    // Adding Galaxy Shape 
    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle = (i % parameters.branches )/ parameters.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

    // Position
    positions[x] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[y] = randomY
    positions[z] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    //Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / parameters.radius)
    colors[x] = mixedColor.r
    colors[y] = mixedColor.g
    colors[z] = mixedColor.b
  }

  // Setting Position Attribute For X,Y,Z
  particleGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
  )

    // Setting Color Attribute For R,G,B
    particleGeometry.setAttribute(
      'color', 
      new THREE.BufferAttribute(colors, 3)
    )

  // Material
  particleMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  // Points
  points = new THREE.Points(
    particleGeometry, particleMaterial
  )

  scene.add(points)

}
generateGalaxy()

// Parameter Tweaks
gui.add(parameters, 'count').min(10).max(75000).step(10).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.05).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

// Window Size
const size = {
  height: window.innerHeight,
  width: window.innerWidth
}

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = 10
camera.position.y = 5
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

// Timer
const timer = new Timer()

// Animating Function
const animate = () => {
  // Elapsed Time
  timer.update()
  const elapsed = timer.getElapsed()
  
  // Orbit Controls
  controls.update()
  controls.enableDamping = true

  // Slow Galaxy Animation
  points.rotation.y = elapsed / 32

  // Rendering Scene
  renderer.render(scene, camera)

  // Performs Animation
  window.requestAnimationFrame(animate)
}
animate()