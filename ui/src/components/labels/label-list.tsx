'use client';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    DataGrid,
    GridColDef,
    GridFilterModel,
    GridRowParams,
    gridClasses,
} from '@mui/x-data-grid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useCallback, useState } from 'react';

import { ListFilterInput } from '~/components/labels/label-list/list-filter-input';
import { LabelListToggleButtons } from '~/components/labels/label-list/list-toggle-buttons';
import { useLabelListContext } from '~/contexts/label-list-context';
import { useLabelList } from '~/hooks/labels/use-label-list';
import {
    type LabelEntry,
    type LabelUpdate,
    updateLabel,
} from '~/services/athenaeum';

export const LabelList = () => {
    const { filter, page, pageSize, updatePagination } = useLabelListContext();
    const { labels } = useLabelList();

    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);

    const theme = useTheme();
    const router = useRouter();

    const { mutate } = useMutation<
        { id: string; label: LabelEntry },
        Error,
        { id: string; label: LabelUpdate }
    >({
        mutationFn: updateLabel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['labels'],
                exact: true,
            });
        },
    });

    const processRowUpdate = useCallback(
        (row: LabelEntry) => {
            mutate({
                id: row.id,
                label: { name: row.name },
            });

            return row;
        },
        [mutate]
    );

    const handleModeChange = useCallback(
        (_: MouseEvent<HTMLElement>, newMode: boolean) => {
            setEditMode(newMode);
        },
        [setEditMode]
    );

    const handleRowClick = useCallback(
        (row: GridRowParams<LabelEntry>, e: MouseEvent<HTMLElement>) => {
            /* @ts-expect-error -- React doesn't think `localName` exists... React is wrong */
            if (editMode || e.target.localName === 'input') {
                return;
            }

            router.push(`/labels/${row.id}`);
        },
        [editMode, router]
    );

    const filterModel: GridFilterModel = { items: [] };
    if (filter) {
        filterModel.items.push({
            field: 'name',
            operator: 'contains',
            value: filter,
        });
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'name',
            minWidth: 300,
            flex: 1,
            sortable: false,
            editable: editMode,
        },
        {
            field: 'model_count',
            headerName: 'Model Count',
            width: 150,
            sortable: false,
        },
    ];

    return (
        <>
            <Box
                component="div"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBlock: '1rem',
                    position: 'sticky',
                    top: '4rem',
                    zIndex: 1,
                }}
            >
                <Box component="div" sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        exclusive
                        aria-label="outlined primary button group"
                        onChange={handleModeChange}
                        value={editMode}
                    >
                        <ToggleButton value={false} title="View mode">
                            <VisibilityIcon />
                        </ToggleButton>
                        <ToggleButton value={true} title="Edit mode">
                            <EditIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <ListFilterInput />
                </Box>

                <LabelListToggleButtons />
            </Box>
            <Box
                component="div"
                sx={{
                    height: 'calc(100vh - 18.25rem)',
                    overflow: 'hidden',
                    paddingBlockStart: '0.5rem',
                }}
            >
                <DataGrid
                    disableColumnMenu
                    disableColumnSelector
                    checkboxSelection={editMode}
                    rowSelection={false}
                    rows={labels}
                    columns={columns}
                    filterModel={filterModel}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={updatePagination}
                    pageSizeOptions={[25, 50, 100]}
                    onRowClick={handleRowClick}
                    processRowUpdate={processRowUpdate}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            cursor: editMode ? 'default' : 'pointer',
                        },
                        [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
                            {
                                outline: 'none !important',
                            },
                        [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                            {
                                outline: 'none !important',
                            },
                    }}
                />
            </Box>
        </>
    );
};
