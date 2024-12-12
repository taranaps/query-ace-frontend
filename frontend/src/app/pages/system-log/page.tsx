"use client";

import React, { useState } from "react";
import { systemLogs, adminList } from "@/app/components/Data/system-log";
// import styles from "./Components/filter.module.css";
import Filter from "@/app/components/filter/filter";
import "./page.css";


const SystemLog: React.FC = () => {
  const [filteredLogs, setFilteredLogs] = useState(systemLogs);

  const handleFilterChange = (selectedAdmins: string[]) => {
    if (selectedAdmins.length === 0) {
      setFilteredLogs(systemLogs); // Reset to all logs if no filters
    } else {
      setFilteredLogs(
        systemLogs.filter((log) => selectedAdmins.includes(log.user))
      );
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        {/* Sidebar navigation (optional) */}
      </div>

      <div className="content">
        <header>
          <h1>System Log</h1>
          <Filter admins={adminList} onFilterChange={handleFilterChange} />
        </header>

        <div className="logs">
          {filteredLogs.map((log, index) => (
            <div className="log-item" key={index}>
              <span className="time">{log.time}</span>
              <div className="circle"></div>
              <div>
                <span className="user">&nbsp; &nbsp;{log.user}</span>
                <span className="action">
                  {log.action === "Edited" ? (
                    <a href="#">{log.action}</a>
                  ) : (
                    <>{log.action}</>
                  )}
                </span>
                <span className="details">{log.details} &nbsp;</span>
                <span className="actionTypes">{log.actionTypes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLog;
