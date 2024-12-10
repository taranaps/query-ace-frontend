// src/app/components/MainLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../sidebar/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;