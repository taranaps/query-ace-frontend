"use client";

import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import MainLayout from './components/main-layout/MainLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <MainLayout>{children}</MainLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
