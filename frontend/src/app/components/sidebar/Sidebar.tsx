import React, { useState } from 'react';
import { Box, Divider, Drawer, List, Typography } from '@mui/material';
import SidebarItem from '../sidebar-item/Sidebar';
import { Home, Search, Settings, List as ListIcon } from '@mui/icons-material';

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState(0);

    const menuItems = [
        { icon: <Home />, label: 'Home' },
        { icon: <Search />, label: 'Search' },
        { icon: <ListIcon />, label: 'List' },
        { icon: <Settings />, label: 'Settings' },
    ];

    const handleItemClick = (index: number) => {
        setActiveItem(index);
        // Add your navigation logic here
    };

    return (
        <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Typography variant="h6">ACE Queries</Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeItem === index}
                        onClick={() => handleItemClick(index)}
                    />
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;