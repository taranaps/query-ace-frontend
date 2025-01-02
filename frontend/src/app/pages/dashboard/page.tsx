"use client";

import React, { useState, useEffect } from 'react';
import DataCardDashboard from '@/app/components/dashboard-datacard/DataCardDashboard';
import styles from './dashboard.module.css';
import searchQueryResult from '@/app/interface/query/searchQueryResult';
import fetchQueryUsingKeyword from '@/app/api/queries/fetchQueryUsingKeyword';

const Dashboard: React.FC = () => {
  const [searchKeyword, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<searchQueryResult[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchKeyword) {
        fetchQueryUsingKeyword(searchKeyword)
          .then((data) => setSearchResults(data))
          .catch((error) => console.error('Error fetching search results:', error));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = (id: number) => console.log(`Delete card with id: ${id}`);
  const handleEdit = (id: number) => console.log(`Edit card with id: ${id}`);

  return (
    <div className={styles.dashboard}>
      <div className={styles['dashboard-search-bar']}>
        <img src="/assets/icons/cross-grey-icon.png" alt="Clear" />
        <input
          placeholder="Search..."
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <img src="/assets/icons/search-grey-icon.png" alt="Search" />
      </div>
      <div className={styles['dashboard-body']}>
        <div className={styles['dashboard-content']}>
          {searchKeyword === '' && (
            <div className={styles['image-placeholder']}>
              <img src="/assets/images/dashboard-clipboard.png" alt="No Results" />
            </div>
          )}

          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <DataCardDashboard
                key={result.id}
                id={result.id}
                question={result.question}
                customer={"Customer"}
                createdBy={result.usersUsername}
                createdAt={result.queryCreatedAt}
                answer={result.answers[0]?.answer || "No Answer"}
                tags={result.tags}
                deleteOn={true}
                editOn={true}
                copyOn={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          ) : (
            searchKeyword !== '' && (
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
