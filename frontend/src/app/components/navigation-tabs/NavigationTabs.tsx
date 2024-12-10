'use client';

import React, { useState } from 'react';
import AddRecordForm from '../add-record-form/AddRecordForm';
import styles from '../navigation-tabs/NavigationTabs.module.css';
import ImportFilesPage from '../import-query-page/ImportQueryPage';

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState('addQuery');

  const renderContent = () => {
    if (activeTab === 'addQuery') {
      return <AddRecordForm />;
    } else if (activeTab === 'importQuery') {
      return  <ImportFilesPage />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.whiteBox}>
        <div className={styles.navBar}>
          <button
            className={`${styles.navTab} ${activeTab === 'addQuery' ? styles.active : ''}`}
            onClick={() => setActiveTab('addQuery')}
          >
            Add Query
          </button>
          <button
            className={`${styles.navTab} ${activeTab === 'importQuery' ? styles.active : ''}`}
            onClick={() => setActiveTab('importQuery')}
          >
            Import Query
          </button>
        </div>
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default NavigationTabs;
