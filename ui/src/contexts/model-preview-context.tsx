'use client';

import {
    type MouseEvent,
    type PropsWithChildren as PWC,
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react';

type PreviewFlags = 'showAxes';

export interface PreviewSettings {
    rotation: {
        x: 0 | 1 | 2 | 3;
        y: 0 | 1 | 2 | 3;
        z: 0 | 1 | 2 | 3;
    };
    scale: number;
}

interface ModelPreviewContextType {
    flags: string[];
    settings: PreviewSettings;
    updateFlags: (_: MouseEvent<HTMLElement>, newFlags: PreviewFlags[]) => void;
    updateSettings: (newSettings: PreviewSettings) => void;
}

export const ModelPreviewContext =
    createContext<null | ModelPreviewContextType>(null);

export const ModelPreviewProvider = ({ children }: PWC) => {
    const [flags, setFlags] = useState<PreviewFlags[]>(['showAxes']);
    const [settings, setSettings] = useState<PreviewSettings>({
        rotation: { x: 1, y: 0, z: 0 },
        scale: 5,
    });

    const ctx: ModelPreviewContextType = {
        flags,
        settings,
        updateFlags: useCallback(
            (_: MouseEvent<HTMLElement>, newFlags: PreviewFlags[]) => {
                setFlags(newFlags);
            },
            [setFlags]
        ),
        updateSettings: useCallback(
            (newSettings: PreviewSettings) => {
                setSettings(newSettings);
            },
            [setSettings]
        ),
    };

    return (
        <ModelPreviewContext.Provider value={ctx}>
            {children}
        </ModelPreviewContext.Provider>
    );
};

export const useModelPreviewContext = (): ModelPreviewContextType => {
    const context = useContext(ModelPreviewContext);

    if (!context) {
        throw new Error(
            'useModelPreviewContext must be used within a ModelPreviewProvider'
        );
    }

    return context;
};
