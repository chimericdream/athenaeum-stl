'use client';

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type MouseEvent,
    type PropsWithChildren as PWC,
} from 'react';

type PreviewFlags = 'showAxes';

export interface PreviewSettings {
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
        scale: 5,
    });

    const ctx: ModelPreviewContextType = {
        flags: flags,
        settings: settings,
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
