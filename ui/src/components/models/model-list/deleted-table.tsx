'use client';

import FilePresentIcon from '@mui/icons-material/FilePresent';
import ImageIcon from '@mui/icons-material/Image';
import LayersIcon from '@mui/icons-material/Layers';
import NoAdultContentIcon from '@mui/icons-material/NoAdultContent';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Badge, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    DataGrid,
    type GridColDef,
    type GridFilterModel,
    type GridRenderCellParams,
    gridClasses,
} from '@mui/x-data-grid';

import { ListFilterInput } from '~/components/models/model-list/list-filter-input';
import { ImportedAt } from '~/components/typography/imported-at';
import { useModelListContext } from '~/contexts/model-list-context';
import { type ModelWithMetadata } from '~/services/athenaeum';

export const DeletedModelTable = ({
    models,
    tableHeight,
}: {
    models: ModelWithMetadata[];
    tableHeight: string;
}) => {
    const { filter, page, pageSize, updatePagination } = useModelListContext();

    const theme = useTheme();

    const cols: GridColDef<ModelWithMetadata>[] = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 450,
            flex: 1,
            editable: false,
            sortable: false,
            renderCell: ({ row }: GridRenderCellParams<ModelWithMetadata>) => {
                if (row.metadata?.nsfw) {
                    return (
                        <>
                            {row.name}
                            <NoAdultContentIcon
                                color="error"
                                sx={{ marginLeft: '0.5rem' }}
                                titleAccess="Model is NSFW"
                            />
                        </>
                    );
                }
                return row.name;
            },
        },
        {
            field: 'id',
            headerName: 'Files',
            width: 188,
            sortable: false,
            hideable: false,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams<ModelWithMetadata>) => (
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
            renderCell: (params: GridRenderCellParams<ModelWithMetadata>) => (
                <ImportedAt dateOnly dateTime={params.value} variant="body2" />
            ),
            width: 175,
            sortable: false,
            hideable: false,
            filterable: false,
        },
    ];

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
                    paddingBlock: '1rem',
                    position: 'sticky',
                    top: '4rem',
                    zIndex: 1,
                }}
            >
                <ListFilterInput />
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
                    checkboxSelection
                    rowSelection={false}
                    rows={models}
                    columns={cols}
                    filterModel={filterModel}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={updatePagination}
                    pageSizeOptions={[25, 50, 100]}
                    sx={{
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
