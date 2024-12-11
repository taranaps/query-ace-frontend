import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../sidebar/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>

            <Box sx={{ flexShrink: 0 }}>
                <Sidebar />
            </Box>

            {/* Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: '2rem 2rem 2rem 20rem',
                    backgroundColor: '#f2f2f2',
                    overflowY: 'hidden',
                }}
            >
                <Box
                    sx={{
                        padding: '1rem',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        height: '90vh'

                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
