
"use client";

"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Data Security');

  const metrics = [
    { value: '52K', label: 'Queries Copied', bgColor: styles.metricOrange },
    { value: '1000K', label: 'Total Queries', bgColor: styles.metricYellow },
    { value: '10K', label: 'Report Generated', bgColor: styles.metricGreen },
  ];

  const trendingQueries = [
    { id: 1, title: 'About Experion Data Security', date: '28 Jan, 12:30 AM', views: '2,500' },
    { id: 2, title: 'About Experion Data Security', date: '25 Jan, 10:40 PM', views: '1,750' },
    { id: 3, title: 'About Experion Data Security', date: '20 Jan, 10:40 PM', views: '1,150' },
    { id: 4, title: 'About Experion Data Security', date: '15 Jan, 03:29 PM', views: '1,050' },
    { id: 5, title: 'About Experion Data Security', date: '14 Jan, 10:40 PM', views: '840' },
  ];

  const pieChartData = [
    { name: 'Label 1', value: 48.8 },
    { name: 'Label 2', value: 24.3 },
    { name: 'Label 3', value: 14.6 },
    { name: 'Label 4', value: 12.3 },
  ];

  const COLORS = ['#6366f1', '#a5b4fc', '#818cf8', '#c7d2fe'];

  const barData = {
    labels: ['Edited', 'Deleted', 'Copied'],
    datasets: [
      {
        label: 'User Actions',
        data: [30, 50, 40],
        backgroundColor: ['#F4A261', '#E76F51', '#2A9D8F'],
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { stepSize: 10 },
      },
    },
  };

  const tabs = ['Data Security', 'End Point Device Security', 'Privacy'];

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.dashboardMain}>
        {/* Left Column - Metrics, Search Bar, and Trending Queries */}
        <div className={styles.dashboardLeft}>
          {/* Metrics */}
          <div className={styles.metricsContainer}>
            {metrics.map((metric, index) => (
              <div key={index} className={`${styles.metricCard} ${metric.bgColor}`}>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBar}
            />
          </div>

          {/* Trending Queries */}
          <div className={styles.trendingQueriesContainer}>
            <h2 className={styles.trendingTitle}>Trending Queries</h2>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`${styles.tabButton} ${
                    selectedTab === tab ? styles.tabActive : styles.tabInactive
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.queriesContent}>
              {trendingQueries.map((query) => (
                <div key={query.id} className={styles.queryItem}>
                  <div className={styles.queryInfo}>
                    <div className={styles.queryIcon}>
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                      <div className={styles.queryTitle}>{query.title}</div>
                      <div className={styles.queryDate}>{query.date}</div>
                    </div>
                  </div>
                  <div className={styles.queryViews}>{query.views}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className={styles.dashboardRight}>
          {/* Bar Chart */}
          <div className={styles.chartContainer1}>
            <h2 className={styles.chartTitle}>User Activity</h2>
            <div className={styles.chartContent}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className={styles.chartContainer2}>
            <h2 className={styles.chartTitle}>Company Analytics</h2>
            <div className={styles.chartContent}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.pieLegend}>
                {pieChartData.map((data, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className={styles.legendText}>
                      {data.name} ({data.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
