'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    CircularProgress,
    Fab,
    Modal,
    Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteModel } from '~/services/athenaeum';

export const DeleteModelButton = ({ id }: { id: string }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const router = useRouter();

    const queryClient = useQueryClient();
    const { isPending, mutate } = useMutation<boolean, Error, string>({
        mutationFn: deleteModel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['models'],
                exact: true,
            });
            queryClient.removeQueries({
                queryKey: ['models', id],
                exact: true,
            });

            router.push('/models');
        },
    });

    return (
        <>
            <Fab
                variant="circular"
                color="error"
                aria-label="Delete model"
                sx={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
                onClick={() => setShowConfirm((prev) => !prev)}
            >
                <DeleteIcon />
            </Fab>
            <Modal
                open={showConfirm}
                onClose={() => !isPending && setShowConfirm(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    component="div"
                    sx={{
                        display: 'grid',
                        gridTemplateAreas: '". . ." ". card ." ". . ."',
                        gridTemplateColumns: '1fr 70ch 1fr',
                        gridTemplateRows: '1fr min-content 2fr',
                        height: '100%',
                    }}
                    onClick={() => !isPending && setShowConfirm(false)}
                >
                    <Alert
                        severity="warning"
                        sx={{ gridArea: 'card' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertTitle>Are you sure?</AlertTitle>
                        <Typography sx={{ mb: 0 }}>
                            This will send the model to the trash. You can
                            restore it from the trash, or permanently delete it
                            from there.
                        </Typography>
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                mt: 2,
                                gap: 2,
                            }}
                        >
                            <Button
                                disabled={isPending}
                                color="warning"
                                variant="outlined"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isPending}
                                color="error"
                                variant="contained"
                                onClick={() => mutate(id)}
                            >
                                Send to trash
                                {isPending && (
                                    <CircularProgress
                                        sx={{ marginInlineStart: '0.5rem' }}
                                        size="1rem"
                                        color="inherit"
                                    />
                                )}
                            </Button>
                        </Box>
                    </Alert>
                </Box>
            </Modal>
        </>
    );
};
