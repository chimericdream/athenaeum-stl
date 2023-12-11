'use client';

import { Center, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import { useModelPreviewContext } from '~/contexts/model-preview-context';
import { type FileRecord, getStaticUrl } from '~/services/athenaeum';

const Model = ({ file }: { file: FileRecord }) => {
    const { settings } = useModelPreviewContext();

    const url = getStaticUrl(file);
    const isStl = file.file_name.endsWith('stl');

    const loader = isStl ? STLLoader : OBJLoader;
    const model = useLoader(loader, url);

    return (
        <Canvas>
            {settings.includes('showAxes') && <axesHelper args={[5]} />}
            <perspectiveCamera />
            <hemisphereLight args={['#ddd', '#555', 5]} />
            <pointLight position={[10, 10, 10]} />
            <Center>
                <mesh
                    scale={[0.05, 0.05, 0.05]}
                    rotation={[Math.PI / -2, 0, 0]}
                >
                    <primitive object={model} />
                    <meshPhysicalMaterial color="#049ef4" />
                </mesh>
            </Center>
            <OrbitControls enableDamping />
        </Canvas>
    );
};

export const PartPreview = ({ file }: { file: FileRecord }) => {
    return (
        <Suspense fallback={null}>
            <Model file={file} />
        </Suspense>
    );
};
