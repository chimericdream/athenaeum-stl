'use client';

import PreviewIcon from '@mui/icons-material/Preview';
import { ListItemButton, ListItemText } from '@mui/material';
import { filesize } from 'filesize';
import { useCallback, useState } from 'react';

import { FileRecordProvider } from '~/components/models/files/file-record-context';
import { NonPreviewModal } from '~/components/models/files/non-preview-modal';
import { PreviewModal } from '~/components/models/files/preview-modal';
import { ModelPreviewProvider } from '~/contexts/model-preview-context';
import { FileCategory, type FileRecord } from '~/services/athenaeum';

export const FileListItem = ({ file }: { file: FileRecord }) => {
    const [selected, setSelected] = useState(false);
    const toggleSelected = useCallback(
        () => setSelected((prev) => !prev),
        [setSelected]
    );
    const deselect = useCallback(() => setSelected(false), [setSelected]);

    const canPreview =
        file.category === FileCategory.IMAGE ||
        file.category === FileCategory.PART ||
        (file.category === FileCategory.SUPPORT &&
            file.file_name.endsWith('txt'));

    const showPreviewModal = canPreview && selected;
    const showNonPreviewModal = !canPreview && selected;

    return (
        <FileRecordProvider file={file} deselect={deselect}>
            <ModelPreviewProvider>
                <ListItemButton onClick={toggleSelected}>
                    <ListItemText
                        primary={file.name}
                        secondary={
                            file.file_size
                                ? filesize(file.file_size, { round: 1 })
                                : null
                        }
                    />
                    <PreviewIcon />
                </ListItemButton>
                {showPreviewModal && <PreviewModal selected={selected} />}
                {showNonPreviewModal && <NonPreviewModal selected={selected} />}
            </ModelPreviewProvider>
        </FileRecordProvider>
    );
};
