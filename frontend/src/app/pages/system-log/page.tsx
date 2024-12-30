"use client";

import React, { useState, useEffect } from "react";
import { systemLogs, adminList} from "../../components/Data/system-log";
import Filter from "@/app/components/filter/filter";
import styles from "./systemLog.module.css";

const SystemLog: React.FC = () => {
  const [filteredLogs, setFilteredLogs] = useState(systemLogs);
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const logs = [
    { date: "2024-12-25", text: "User Arun Kumar added Manoj Kumar as Admin" },
    { date: "2024-12-24", text: "Sreehari Narayanan edited query C001" },
    { date: "2024-12-23", text: "Parvathy Eeshwar removed Arun Mathew from Admin" },
    { date: "2024-12-23", text: "Parvathy Eeshwar removed Arun Mathew from Admin" },
    { date: "2024-12-23", text: "Parvathy Eeshwar removed Arun Mathew from Admin" },
    { date: "2024-12-23", text: "Parvathy Eeshwar removed Arun Mathew from Admin" },
    { date: "2024-12-23", text: "Parvathy Eeshwar removed Arun Mathew from Admin" },
  ];

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setVisibleIndexes((prev) => {
        const newVisibleIndexes = [...prev, index];
        console.log("Visible Indexes:", newVisibleIndexes); 
        return newVisibleIndexes;
      });
      index++;
      if (index >= logs.length) clearInterval(interval);
    }, 300); 

    return () => clearInterval(interval);
  }, [logs.length]); 

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h6>System Log</h6>
          <p>Actions done by admins</p>
        </div>
        <div className={styles.headerRight}>
          <Filter admins={adminList} onFilterChange={() => {}} />
        </div>
      </div>

      <div className={styles.content}>
        {logs.map((log, index) => (
          <div
            key={index}
            className={`${styles.logItem} ${
              visibleIndexes.includes(index) ? styles.visible : ""
            }`}
          >
            <span className={styles.date}>{log.date}</span>
            <div className={styles.circle}></div>
            <span className={styles.text}>{log.text}</span>
            {index < logs.length - 1 && <div className={styles.line}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLog;
