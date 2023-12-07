'use client';

import { Center, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import { FileRecord, getStaticUrl } from '~/services/athenaeum';

export const StlPreview = ({ file }: { file: FileRecord }) => {
    const url = getStaticUrl(file);
    const model = useLoader(STLLoader, url);

    return (
        <Canvas>
            <axesHelper args={[5]} />
            <perspectiveCamera />
            <hemisphereLight args={['#ddd', '#555', 5]} />
            <pointLight position={[10, 10, 10]} />
            <Center>
                <mesh
                    scale={[0.05, 0.05, 0.05]}
                    rotation={[0, 0, Math.PI / -2]}
                >
                    <primitive object={model} position={[0, 0, 0]} />
                    <meshPhysicalMaterial color="#049ef4" />
                </mesh>
            </Center>
            <OrbitControls enableDamping />
        </Canvas>
    );
};

/*
import * as THREE from 'three'
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import { STLLoader } from '/jsm/loaders/STLLoader.js'
import Stats from '/jsm/libs/stats.module.js'

const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add( new THREE.HemisphereLight( '#ccc', '#555', 5 ) );
const material = new THREE.MeshPhysicalMaterial({color: '#049ef4'});

const loader = new STLLoader()

let mesh
loader.load(
    '/models/example.stl',
    function (geometry) {
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
    },
    (xhr) => {},
    (error) => {
        console.log(error)
    }
)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize', onWindowResize, false)

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    if (mesh) {
        mesh.rotation.y += 0.0025
        mesh.rotation.z += 0.00125
    }
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
*/