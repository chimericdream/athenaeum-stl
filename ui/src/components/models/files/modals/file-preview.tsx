import { Alert } from '@mui/material';
import { Component, type PropsWithChildren as PWC } from 'react';

import { ImagePreview } from '~/components/models/files/renderers/image';
import { PartPreview } from '~/components/models/files/renderers/part';
import { PdfPreview } from '~/components/models/files/renderers/pdf';
import { TextPreview } from '~/components/models/files/renderers/txt';
import { FileCategory, type FileRecord } from '~/services/athenaeum';

class PreviewErrorBoundary extends Component<PWC> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Alert severity="error">Unable to preview file</Alert>;
        }

        return this.props.children;
    }
}

export const FilePreview = ({ file }: { file: FileRecord }) => {
    return (
        <PreviewErrorBoundary>
            {file.category === FileCategory.IMAGE && (
                <ImagePreview file={file} />
            )}
            {(file.category === FileCategory.PART ||
                file.category === FileCategory.PROJECT) && (
                <PartPreview file={file} />
            )}
            {file.category === FileCategory.SUPPORT && (
                <>
                    {file.file_name.endsWith('txt') && (
                        <TextPreview file={file} />
                    )}
                    {file.file_name.endsWith('pdf') && (
                        <PdfPreview file={file} />
                    )}
                </>
            )}
        </PreviewErrorBoundary>
    );
};
