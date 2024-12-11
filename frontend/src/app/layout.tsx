// src/app/layout.tsx
"use client";
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import MainLayout from '../app/components/main-layout/MainLayout';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pagesWithoutLayout = ['/pages/login'];
  return (<html lang="en">
    <body>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!pagesWithoutLayout.includes(pathname) && (<MainLayout>{children}</MainLayout>)}
        {pagesWithoutLayout.includes(pathname) && <>{children}</>}        </ThemeProvider>
    </body>
  </html>
  );
}