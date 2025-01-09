// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { SystemLog } from "types/system-log";
// import { fetchAllLogs, fetchUserLogs } from "@/app/api/system-log/root";
// import { fetchUserNames } from "@/app/api/admin/user-names/root";
// import { isAuthenticated } from "@/app/lib/auth";
// import Pagination from "@/app/components/pagination/Pagination";
// import styles from "./systemLog.module.css";

// const SystemLogPage: React.FC = () => {
//   const [logs, setLogs] = useState<SystemLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
//   const [userNames, setUserNames] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push("/login");
//       return;
//     }

//     const loadUserNames = async () => {
//       try {
//         const names = await fetchUserNames();
//         setUserNames(names);
//       } catch (err:any) {
//         console.error("Error fetching user names:", err);
//         if (err.response?.status === 401) {
//           setError("Unauthorized access. Please log in."); 
//         }
//       }
//     };

//     loadUserNames();
//   }, []);

//   const loadLogs = async (page: number) => {
//     try {
//       setLoading(true);
//       setVisibleIndexes([]);
//       const data = await fetchAllLogs(page - 1);
//       setLogs(data);
//       setTotalPages(Math.ceil(data.length / 10));
//     } catch (err) {
//       setError("Failed to load logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLogs(currentPage);
//   }, [currentPage]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleFilterChange = async (selectedItems: string[]) => {
//     try {
//       setLoading(true);
//       setVisibleIndexes([]);

//       if (selectedItems.length === 1) {
//         const userId = parseInt(selectedItems[0]);
//         const userLogs = await fetchUserLogs(userId, 0);
//         setLogs(userLogs.length > 0 ? userLogs : []);
//         setTotalPages(userLogs.length > 0 ? Math.ceil(userLogs.length / 10) : 1);
//       } else {
//         await loadLogs(1);
//       }
//     } catch (err) {
//       setError("Failed to filter logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!loading && logs.length > 0) {
//       const totalEntries = logs.reduce((sum, dateGroup) => sum + dateGroup.logs.length, 0);
//       let currentIndex = 0;

//       const interval = setInterval(() => {
//         if (currentIndex >= totalEntries) {
//           clearInterval(interval);
//           return;
//         }

//         setVisibleIndexes((prev) => [...prev, currentIndex]);
//         currentIndex++;
//       }, 100);

//       return () => clearInterval(interval);
//     }
//   }, [loading, logs]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.headerLeft}>
//           <h6>System Log</h6>
//           <p>Actions done by admins</p>
//         </div>
        
//       </div>
//       <div className={styles.content}>
//         {logs.length > 0 ? (
//           logs.map((dateGroup, dateIndex) => (
//             <div key={dateGroup.date} className={styles.dateGroup}>
//               <h3 className={styles.dateHeading}>{dateGroup.date}</h3>
//               {dateGroup.logs.map((log, logIndex) => {
//                 const globalIndex = logs
//                   .slice(0, dateIndex)
//                   .reduce((sum, group) => sum + group.logs.length, 0) + logIndex;

//                 return (
//                   <div
//                     key={`${dateGroup.date}-${logIndex}`}
//                     className={`${styles.logItem} ${
//                       visibleIndexes.includes(globalIndex) ? styles.visible : ""
//                     }`}
//                   >
//                     <span className={styles.time}>{log.time}</span>
//                     <div className={styles.circle}></div>
//                     <div className={styles.spaceAfterCircle}></div>
//                     <span className={styles.text}>{log.description}</span>
//                     {logIndex < dateGroup.logs.length - 1 && <div className={styles.line}></div>}
//                   </div>
//                 );
//               })}
//             </div>
//           ))
//         ) : (
//           <div className={styles.noLogsMessage}>No logs available for the selected user.</div>
//         )}
//       </div>
//       <div className={styles.paginationContainer}>
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default SystemLogPage;
