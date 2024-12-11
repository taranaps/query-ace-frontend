'use client';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

import "./Navbar.css";

const Navbar = () => {

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => (pathname === path ? 'active' : '');

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <div className="logo">
          ACE Queries
        </div>
      </div>
      <div className="midlle">

        <nav className="nav">
          <ul>
            <li className={isActive('/data-vault')} onClick={() => navigateTo('/data-vault')}>
              Data Vault
            </li>
            <li className={isActive('/add-queries')} onClick={() => navigateTo('/login')}>
              Add Queries
            </li>
            <li className={isActive('/file-processing')} onClick={() => navigateTo('/file-processing')}>
              File Processing
            </li>
            <li className={isActive('/manage-accounts')} onClick={() => navigateTo('/manage-accounts')}>
              Manage Accounts
            </li>
            <li className={isActive('/data-lookup')} onClick={() => navigateTo('/data-lookup')}>
              Data Lookup
            </li>
            <li className={isActive('/insights')} onClick={() => navigateTo('/insights')}>
              Insights
            </li>
            <li className={isActive('/system-log')} onClick={() => navigateTo('/system-log')}>
              System Log
            </li>
          </ul>
        </nav>
      </div>
      <div className="bottom">
        <ul>
          <li onClick={() => navigateTo('/logout')}>Logout</li>
        </ul>
      </div>
    </div >
  );
};

export default Navbar;
