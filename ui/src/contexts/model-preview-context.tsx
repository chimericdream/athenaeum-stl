'use client';

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type MouseEvent,
    type PropsWithChildren as PWC,
} from 'react';

type PreviewSettings = 'showAxes';

interface ModelPreviewContextType {
    settings: string[];
    updateSettings: (
        _: MouseEvent<HTMLElement>,
        newSettings: PreviewSettings[]
    ) => void;
}

export const ModelPreviewContext =
    createContext<null | ModelPreviewContextType>(null);

export const ModelPreviewProvider = ({ children }: PWC) => {
    const [settings, setSettings] = useState<PreviewSettings[]>(['showAxes']);

    const ctx: ModelPreviewContextType = {
        settings,
        updateSettings: useCallback(
            (_: MouseEvent<HTMLElement>, newSettings: PreviewSettings[]) => {
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
