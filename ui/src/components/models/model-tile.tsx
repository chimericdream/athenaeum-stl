import FilePresentIcon from '@mui/icons-material/FilePresent';
import ImageIcon from '@mui/icons-material/Image';
import LayersIcon from '@mui/icons-material/Layers';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Badge } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import type { Model } from '~/services/athenaeum';

export const ModelTile = ({ model }: { model: Model }) => {
    const theme = useTheme();

    const IMG_SIZE = '12rem';

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h5" component="div">
                    {model.name}
                </Typography>
                <Typography
                    component="div"
                    sx={{
                        height: IMG_SIZE,
                        textAlign: 'center',
                    }}
                >
                    <ViewInArIcon sx={{ fontSize: IMG_SIZE }} />
                </Typography>
            </CardContent>
            <CardActions
                sx={{ borderTop: `1px solid ${theme.palette.grey[800]}` }}
            >
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        width: '100%',
                    }}
                >
                    <Badge
                        showZero
                        badgeContent={
                            model.part_count > 0 ? model.part_count : '!'
                        }
                        color={model.part_count > 0 ? 'primary' : 'error'}
                        title="Part files"
                        sx={{ mt: 1 }}
                    >
                        <ViewInArIcon />
                    </Badge>
                    <Badge
                        badgeContent={model.image_count}
                        color="primary"
                        title="Image files"
                        sx={{ mt: 1 }}
                    >
                        <ImageIcon />
                    </Badge>
                    <Badge
                        badgeContent={model.project_count}
                        color="primary"
                        title="Project files"
                        sx={{ mt: 1 }}
                    >
                        <LayersIcon />
                    </Badge>
                    <Badge
                        badgeContent={model.support_file_count}
                        color="primary"
                        title="Support files"
                        sx={{ mt: 1 }}
                    >
                        <FilePresentIcon />
                    </Badge>
                </Box>
            </CardActions>
        </Card>
    );
};
