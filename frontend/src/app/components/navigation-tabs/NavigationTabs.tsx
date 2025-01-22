"use client";

/**
 * @module NavigationTabs
 *
 * Renders a navigation bar with tabs for switching between "Add Query" and "Import Query" content.
 * Manages the active tab state and dynamically updates the content displayed based on the selected tab.
 */

import React, { useState } from "react";
import AddRecordForm from "../add-record-form/AddRecordForm";
import styles from "../navigation-tabs/NavigationTabs.module.css";
import ImportFilesPage from "../import-query-page/ImportQueryPage";

/**
 * A functional React component that provides a navigation bar for switching between two tabs:
 * "Add Query" and "Import Query."
 *
 * @function NavigationTabs
 * @memberof module:NavigationTabs
 *
 * @returns {JSX.Element} The rendered NavigationTabs component.
 *
 * @example
 * // Example usage:
 * import NavigationTabs from "@/app/components/navigation-tabs/NavigationTabs";
 *
 * export default function App() {
 *   return <NavigationTabs />;
 * }
 *
 * @throws Will throw an error if required child components like AddRecordForm or ImportFilesPage are not found.
 * @todo Add more tabs and content dynamically based on user roles or preferences.
 */
const NavigationTabs = () => {
  /**
   * @typedef {"addQuery" | "importQuery"} TabType
   * @description Defines the possible active tab types.
   */

  /**
   * @type {[TabType, React.Dispatch<React.SetStateAction<TabType>>]}
   * Maintains the state of the active tab. Defaults to "addQuery".
   */
  const [activeTab, setActiveTab] = useState("addQuery");

  /**
   * Renders the content corresponding to the active tab.
   *
   * @function renderContent
   * @memberof module:NavigationTabs
   *
   * @returns {JSX.Element} The content to display based on the active tab.
   */
  const renderContent = () => {
    if (activeTab === "addQuery") {
      return <AddRecordForm />;
    } else if (activeTab === "importQuery") {
      return <ImportFilesPage />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.whiteBox}>
        <div className={styles.navBar}>
          <button
            className={`${styles.navTab} ${
              activeTab === "addQuery" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("addQuery")}
          >
            Add Query
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === "importQuery" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("importQuery")}
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
