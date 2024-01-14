'use client';

import { Center, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import type { BufferGeometry, Group, NormalBufferAttributes } from 'three';
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

const isBufferGeometry = (
    obj: BufferGeometry<NormalBufferAttributes> | Group
): obj is BufferGeometry<NormalBufferAttributes> => {
    /* @ts-expect-error */
    return typeof obj.computeVertexNormals === 'function';
};

const Model = ({ file, flags, scale, settings }: ModelProps) => {
    const url = getStaticUrl(file);
    const isStl = file.file_name.toLowerCase().endsWith('stl');

    const loader = isStl ? STLLoader : OBJLoader;
    const model: BufferGeometry<NormalBufferAttributes> | Group = useLoader(
        loader,
        url
    );

    const isBuffer = isBufferGeometry(model);

    if (isBuffer) {
        model.computeVertexNormals();
    }

    const { rotation } = settings;
    const { x, y, z } = rotation;

    return (
        <Canvas>
            <scene position={[0, 0, 0]} />
            {flags.includes('showAxes') && <axesHelper args={[5]} />}
            <hemisphereLight args={['#ddd', '#555', 5]} />
            <perspectiveCamera
                args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
                position={[2.5, 2.5, 2.5]}
            />
            <Center>
                <mesh
                    scale={[scale, scale, scale]}
                    rotation={[
                        x * (Math.PI / -2),
                        y * (Math.PI / -2),
                        z * (Math.PI / -2),
                    ]}
                    position={[-4, -5, -0.5]}
                >
                    <primitive object={model} />
                    <meshPhysicalMaterial
                        color="#049ef4"
                        metalness={0.5}
                        roughness={1.0}
                        clearcoat={1.0}
                        clearcoatRoughness={0.25}
                    />
                </mesh>
            </Center>
            <OrbitControls enableDamping />
        </Canvas>
    );
};

export const PartPreview = ({ file }: { file: FileRecord }) => {
    const { flags, settings } = useModelPreviewContext();
    const rotation = settings.rotation;
    const scale = settings.scale / 100;

    return (
        <Suspense fallback={null}>
            <Model
                key={`${file.id}-s${scale}-r${JSON.stringify(rotation)}}`}
                file={file}
                flags={flags}
                scale={scale}
                settings={settings}
            />
        </Suspense>
    );
};
