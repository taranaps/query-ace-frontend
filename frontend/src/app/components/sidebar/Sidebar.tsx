"use client";

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import './sidebarmodule.css';

const Sidebar = React.memo(() => {
    console.log('Sidebar rendered');

    const router = useRouter();
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const navItems = [
        { navigationPath: '/dashboard', iconPath: '/icons/home-icon.svg', label: 'Home' },
        { navigationPath: '/add-queries', iconPath: '/icons/add-icon.svg', label: 'Add Queries' },
        { navigationPath: '/file-processing', iconPath: '/icons/file-processing-icon.svg', label: 'File Processing' },
        { navigationPath: '/manage-accounts', iconPath: '/icons/manage-accounts-icon.svg', label: 'Manage Accounts' },
        { navigationPath: '/data-lookup', iconPath: '/icons/data-lookup-icon.svg', label: 'Data Lookup' },
        { navigationPath: '/insights', iconPath: '/icons/insights-icon.svg', label: 'Insights' },
        { navigationPath: '/system-log', iconPath: '/icons/system-log-icon.svg', label: 'System Log' },
    ];
    

    useEffect(() => {
        const index = navItems.findIndex((item) => item.navigationPath === pathname);
        if (index !== -1) setActiveIndex(index);
    }, [pathname]);

    const navigateTo = (path: string, index: number) => {
        setActiveIndex(index);
        router.push(`/pages${path}`);
    };
    

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-image">A</div>
                    <div className="sidebar-logo-text">ACE Queries</div>
                </div>
            </div>

            <div className="sidebar-middle">
                <div
                    className="active-indicator"
                    style={{
                        top: `${activeIndex * 4}rem`,
                        transition: 'top 0.3s ease',
                    }}
                ></div>
                <div className="sidebar-nav-list">
                    {navItems.map(({ navigationPath, iconPath, label }, index) => (
                        <div
                            key={navigationPath}
                            className={`sidebar-nav-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => navigateTo(navigationPath, index)}
                        >
                            <img
                                src={iconPath}
                                alt={`${label} Icon`}
                                className="sidebar-nav-item-icon"
                            />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-bottom">
                <div
                    className="sidebar-nav-item"
                    onClick={() => navigateTo('/logout', navItems.length)}
                >
                    <img
                        src="../../../public/icons/logout-icon.svg'"
                        alt=""
                        className="sidebar-nav-item-icon"
                    />
                    Logout</div>
                <div className="sidebar-bottom-account-details">
                    <div className="sidebar-bottom-account-details-profile"></div>
                    <div className="sidebar-bottom-account-details-name-and-email">
                        <div className="sidebar-bottom-account-details-name">Sreehari Narayanan</div>
                        <div className="sidebar-bottom-account-details-email">sreeeharinarayanan@experionglobal.com</div>
                    </div>
                </div>
            </div>
        </aside>
    );
});

export { Sidebar };
