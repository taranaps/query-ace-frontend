"use client";

import React, { useState } from 'react';
import DataCardDashboard from '@/app/components/dashboard-datacard/DataCardDashboard';
import styles from './dashboard.module.css';

const Dashboard: React.FC = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Cards
  const dataCards = [
    {
      id: 1,
      text: 'Fix User Authentication Bug',
      customer: 'Acme Corp',
      createdBy: 'John Doe',
      createdAt: '2024-12-11',
      description: 'Address the login issue reported by users on the web platform.',
    },
    {
      id: 2,
      text: 'Design New Marketing Campaign',
      customer: 'TechSoft',
      createdBy: 'Jane Smith',
      createdAt: '2024-12-10',
      description: 'Plan a digital campaign for the upcoming product launch.',
    },
    {
      id: 3,
      text: 'Optimize Database Queries',
      customer: 'Global Retailers',
      createdBy: 'Alice Brown',
      createdAt: '2024-12-09',
      description: 'Improve the performance of critical database queries.',
    },
    {
      id: 4,
      text: 'Update Privacy Policy',
      customer: 'FinanceCo',
      createdBy: 'Michael Green',
      createdAt: '2024-12-08',
      description: 'Revise the privacy policy to comply with new regulations.',
    },
    {
      id: 5,
      text: 'Conduct User Feedback Session',
      customer: 'InnovateX',
      createdBy: 'Emily White',
      createdAt: '2024-12-07',
      description: 'Gather feedback from users to improve product features.',
    },
  ];

  // Filter data based on the search query
  const filteredDataCards = searchQuery
    ? dataCards.filter((data) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          data.text.toLowerCase().includes(lowerCaseQuery) ||
          data.customer.toLowerCase().includes(lowerCaseQuery) ||
          data.createdBy.toLowerCase().includes(lowerCaseQuery) ||
          data.createdAt.toLowerCase().includes(lowerCaseQuery) ||
          data.description.toLowerCase().includes(lowerCaseQuery)
        );
      })
    : []; // If searchQuery is empty, no data cards will be shown

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle delete, edit, and copy actions
  const handleDelete = (id: number) => console.log(`Delete card with id: ${id}`);
  const handleEdit = (id: number) => console.log(`Edit card with id: ${id}`);
  const handleCopy = (text: string) => console.log(`Copied text: ${text}`);

  return (
    <div className={styles.dashboard}>
      <div className={styles['dashboard-search-bar']}>
        <img src="/assets/icons/cross-grey-icon.png" alt="Clear" />
        <input
          placeholder="Search..."
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <img src="/assets/icons/search-grey-icon.png" alt="Search" />
      </div>
      <div className={styles['dashboard-body']}>
        <div className={styles['dashboard-content']}>
          {/* Show image if there is no search query or no filtered results */}
          {searchQuery === '' && (
            <div className={styles['image-placeholder']}>
                <img src="/assets/images/dashboard-clipboard.png" alt="No Results" />
                </div>
          )}

          {/* Show filtered data cards */}
          {filteredDataCards.length > 0 ? (
            filteredDataCards.map((data) => (
              <DataCardDashboard
                key={data.id}
                id={data.id}
                text={data.text}
                customer={data.customer}
                createdBy={data.createdBy}
                createdAt={data.createdAt}
                description={data.description}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCopy={handleCopy}
              />
            ))
          ) : (
            // Show message or image when no data matches the search query
            searchQuery !== '' && (
              <div className={styles['image-placeholder']}>
                <img src="/assets/images/dashboard-clipboard.png" alt="No Results" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
