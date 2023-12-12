'use client';

import { Center, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader, type Vector3 } from '@react-three/fiber';
import { useState, Suspense, useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import {
    type PreviewSettings,
    useModelPreviewContext,
} from '~/contexts/model-preview-context';
import { type FileRecord, getStaticUrl } from '~/services/athenaeum';

interface ModelProps {
    file: FileRecord;
    flags: string[];
    scale: number;
    settings: PreviewSettings;
}

const Model = ({ file, flags, scale, settings }: ModelProps) => {
    const url = getStaticUrl(file);
    const isStl = file.file_name.endsWith('stl');

    const loader = isStl ? STLLoader : OBJLoader;
    const model = useLoader(loader, url);

    return (
        <Canvas>
            {flags.includes('showAxes') && <axesHelper args={[5]} />}
            <perspectiveCamera />
            <hemisphereLight args={['#ddd', '#555', 5]} />
            <pointLight position={[10, 10, 10]} />
            <scene position={[0, 0, 0]} />
            <Center>
                <mesh
                    scale={[scale, scale, scale]}
                    rotation={[Math.PI / -2, 0, 0]}
                    position={[0, 0, 0]}
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
    const { flags, settings } = useModelPreviewContext();
    const scale = settings.scale / 100;

    return (
        <Suspense fallback={null}>
            <Model
                key={`${file.id}--scale-${scale}`}
                file={file}
                flags={flags}
                scale={scale}
                settings={settings}
            />
        </Suspense>
    );
};
