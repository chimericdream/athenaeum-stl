import Image from 'next/image';

import { type FileRecord, getStaticUrl } from '~/services/athenaeum';

export const ImagePreview = ({ file }: { file: FileRecord }) => {
    return (
        <Image
            fill
            src={getStaticUrl(file)}
            alt={file.name}
            style={{ objectFit: 'contain' }}
        />
    );
};
