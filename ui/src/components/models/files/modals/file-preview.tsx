import { ImagePreview } from '~/components/models/files/renderers/image';
import { PartPreview } from '~/components/models/files/renderers/part';
import { TextPreview } from '~/components/models/files/renderers/txt';
import { FileCategory, type FileRecord } from '~/services/athenaeum';

export const FilePreview = ({ file }: { file: FileRecord }) => {
    return (
        <>
            {file.category === FileCategory.IMAGE && (
                <ImagePreview file={file} />
            )}
            {file.category === FileCategory.PART && <PartPreview file={file} />}
            {/*{file.category === FileCategory.PROJECT && (*/}
            {/*    <ProjectPreview file={file} />*/}
            {/*)}*/}
            {file.category === FileCategory.SUPPORT && (
                <TextPreview file={file} />
            )}
        </>
    );
};
