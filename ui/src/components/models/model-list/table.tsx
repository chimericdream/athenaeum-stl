'use client';

import EditIcon from '@mui/icons-material/Edit';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ImageIcon from '@mui/icons-material/Image';
import LayersIcon from '@mui/icons-material/Layers';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Badge, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    DataGrid,
    type GridColDef,
    type GridFilterModel,
    type GridRenderCellParams,
    type GridRowParams,
    gridClasses,
} from '@mui/x-data-grid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useCallback, useState } from 'react';

import { ListFilterInput } from '~/components/models/model-list/list-filter-input';
import { ModelListToggleButtons } from '~/components/models/model-list/list-toggle-buttons';
import { ImportedAt } from '~/components/typography/imported-at';
import { useModelListContext } from '~/contexts/model-list-context';
import {
    type Model,
    type ModelRecord,
    type ModelUpdate,
    updateModel,
} from '~/services/athenaeum';

export const ModelTable = ({
    models,
    tableHeight,
}: {
    models: Model[];
    tableHeight: string;
}) => {
    const { filter, page, pageSize, updatePagination } = useModelListContext();

    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);

    const theme = useTheme();
    const router = useRouter();

    const { mutate } = useMutation<
        { id: string; model: ModelRecord },
        Error,
        { id: string; model: ModelUpdate }
    >({
        mutationFn: updateModel,
        onSuccess: async ({ id, model }) => {
            queryClient.setQueryData(['models', id], model);
            await queryClient.invalidateQueries({
                queryKey: ['models'],
                exact: true,
            });
        },
    });

    const processRowUpdate = useCallback(
        (row: Model) => {
            mutate({
                id: row.id,
                model: { name: row.name },
            });

            return row;
        },
        [mutate]
    );

    const cols: GridColDef<Model>[] = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 450,
            flex: 1,
            editable: editMode,
            sortable: false,
        },
        {
            field: 'id',
            headerName: 'Files',
            width: 188,
            sortable: false,
            hideable: false,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams<Model>) => (
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'start',
                        width: '100%',
                    }}
                >
                    <Badge
                        showZero
                        badgeContent={row.part_count > 0 ? row.part_count : '!'}
                        color={row.part_count > 0 ? 'primary' : 'error'}
                        title="Part files"
                    >
                        <ViewInArIcon />
                    </Badge>
                    <Badge
                        badgeContent={row.image_count}
                        color="primary"
                        title="Image files"
                    >
                        <ImageIcon />
                    </Badge>
                    <Badge
                        badgeContent={row.project_count}
                        color="primary"
                        title="Project files"
                    >
                        <LayersIcon />
                    </Badge>
                    <Badge
                        badgeContent={row.support_file_count}
                        color="primary"
                        title="Support files"
                    >
                        <FilePresentIcon />
                    </Badge>
                </Box>
            ),
        },
        {
            field: 'imported_at',
            headerName: 'Imported',
            renderCell: (params: GridRenderCellParams<Model>) => (
                <ImportedAt dateOnly dateTime={params.value} variant="body2" />
            ),
            width: 175,
            sortable: false,
            hideable: false,
            filterable: false,
        },
    ];

    const handleModeChange = useCallback(
        (_: MouseEvent<HTMLElement>, newMode: boolean) => {
            setEditMode(newMode);
        },
        [setEditMode]
    );

    const handleRowClick = useCallback(
        (row: GridRowParams<Model>, e: MouseEvent<HTMLElement>) => {
            /* @ts-expect-error -- React doesn't think `localName` exists... React is wrong */
            if (editMode || e.target.localName === 'input') {
                return;
            }

            router.push(`/models/${row.id}`);
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

                <ModelListToggleButtons />
            </Box>
            <Box
                component="div"
                sx={{
                    height: tableHeight,
                    overflow: 'hidden',
                    paddingBlockStart: '0.5rem',
                }}
            >
                <DataGrid
                    disableColumnMenu
                    disableColumnSelector
                    checkboxSelection={editMode}
                    rowSelection={false}
                    rows={models}
                    columns={cols}
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
