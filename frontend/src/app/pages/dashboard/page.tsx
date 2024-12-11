"use client";

import React from 'react';
import DataCard from '@/app/components/lookup-datacard/DataCard';
import styles from './dashboard.module.css';

const Dashboard: React.FC = () => {
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

  const handleDelete = (id: number) => console.log(`Delete card with id: ${id}`);
  const handleEdit = (id: number) => console.log(`Edit card with id: ${id}`);
  const handleCopy = (text: string) => console.log(`Copied text: ${text}`);

  return (
    <div className={styles.dashboard}>
      <div className={styles['dashboard-search-bar']}>
        <img src="/assets/icons/cross-grey-icon.png" alt="" />
        <input placeholder="Search..." type="text" />
        <img src="/assets/icons/search-grey-icon.png" alt="" />
      </div>
      <div className={styles['dashboard-body']}>
        {dataCards.map((data) => (
          <DataCard
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
