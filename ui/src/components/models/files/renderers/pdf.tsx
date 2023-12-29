'use client';

import { Box } from '@mui/material';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { type FileRecord, getStaticUrl } from '~/services/athenaeum';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

export const PdfPreview = ({ file }: { file: FileRecord }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>();

    const onResize = useCallback<ResizeObserverCallback>(
        (entries) => {
            const [entry] = entries;

            if (entry) {
                setContainerWidth(entry.contentRect.width);
            }
        },
        [setContainerWidth]
    );

    useResizeObserver(containerRef, resizeObserverOptions, onResize);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
    }

    return (
        <Box component="div" sx={{ height: '100%', overflow: 'auto' }}>
            <Box
                component="div"
                ref={setContainerRef}
                sx={{
                    '& > .react-pdf__Document': {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    },
                }}
            >
                <Document
                    file={getStaticUrl(file)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={
                                containerWidth
                                    ? Math.min(containerWidth, maxWidth)
                                    : maxWidth
                            }
                        />
                    ))}
                </Document>
            </Box>
        </Box>
    );
};
