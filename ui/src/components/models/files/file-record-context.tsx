'use client';

import {
    type PropsWithChildren as PWC,
    createContext,
    useContext,
} from 'react';

import { FileRecord } from '~/services/athenaeum';

export interface FileRecordCtx {
    file?: FileRecord;
    deselect?: () => void;
}

const FileRecordContext = createContext<FileRecordCtx>({});

export const FileRecordProvider = ({
    children,
    file,
    deselect,
}: PWC<{
    file: FileRecord;
    deselect: () => void;
}>) => {
    return (
        <FileRecordContext.Provider value={{ file, deselect }}>
            {children}
        </FileRecordContext.Provider>
    );
};

export const useFileRecordContext = () => {
    const context = useContext(FileRecordContext);

    if (context === undefined) {
        throw new Error('usePlayer must be used within a FileRecordProvider');
    }

    return context as Required<FileRecordCtx>;
};
