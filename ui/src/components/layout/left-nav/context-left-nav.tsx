import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

export default function ContextLeftNav() {
    return (
        <>
            <Divider />
            <List>
                <ListSubheader disableSticky>Contexts</ListSubheader>
            </List>
        </>
    );
}
