"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogResponse } from "types/system-log";
import { UserDTO } from "types/system-log";
import { fetchAllLogs, fetchUserLogs } from "@/app/api/system-log/root";
import { fetchUserNames } from "@/app/api/admin/user-names/root";
import { useAuth } from '@/context/AuthContext';
import Pagination from "@/app/components/pagination/Pagination";
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";
import Filter from "@/app/components/filter/filter";
import styles from "./systemLog.module.css";

const DATES_PER_PAGE = 10;

const SystemLogPage: React.FC = () => {
 const [logs, setLogs] = useState<SystemLogResponse>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
 const [userNames, setUserNames] = useState<UserDTO[]>([]);
 const [currentPage, setCurrentPage] = useState(0);
 const [selectedUser, setSelectedUser] = useState<string | null>(null);
 const [hasMoreData, setHasMoreData] = useState(true);

 const router = useRouter();
 const { user } = useAuth();
 const token = localStorage.getItem('token');

 useEffect(() => {
   if (!user || !token) {
     router.push("/pages/login");
     return;
   }

   const loadUserNames = async () => {
     try {
        console.log('Fetching user names...');

       const data = await fetchUserNames(token);
       setUserNames(data);
     } catch (err) {
       console.error("Error fetching user names:", err);
     }
   };

   loadUserNames();
   loadLogs(0);
 }, [user, token, router]);

 const loadLogs = async (pageNumber: number = currentPage, userToLoad: string | null = selectedUser) => {
    try {
      console.log('loadLogs - Start with userToLoad:', userToLoad);
      setLoading(true);
      setVisibleIndexes([]);
      let data;
 
      if (userToLoad) {
         console.log('Trying to fetch user logs for:', userToLoad);
         const userInfo = userNames.find(u => u.username === userToLoad);
         console.log('Found userInfo:', userInfo);
         
         if (!userInfo) {
           setLogs([]);
           setHasMoreData(false);
           setLoading(false);
           return;
         }
         try {
           data = await fetchUserLogs(userInfo.id, pageNumber, token);
           setHasMoreData(data && data.length > 0);
         } catch (error: any) {
           if (error.response?.status === 404) {
             setLogs([]);
             setHasMoreData(false);
           } else {
             throw error;
           }
        }
      } else {
        try {
          data = await fetchAllLogs(pageNumber, token);
          setHasMoreData(data && data.length === DATES_PER_PAGE);
        } catch (error: any) {
          if (error.response?.status === 404) {
            if (pageNumber > 0) {
              setCurrentPage(pageNumber - 1);
              await loadLogs(pageNumber - 1);
              return;
            }
            setLogs([]);
            setHasMoreData(false);
          } else {
            throw error;
          }
        }
      }
 
      if (data) {
        setLogs(data);
        animateLogs(data);
      }
    } catch (err: any) {
      setError("Failed to load logs");
      if (err.response?.status === 401) {
        router.push("/pages/login");
      }
    } finally {
      setLoading(false);
    }
 };
 
 const handleFilterChange = async (username: string | null) => {
     setSelectedUser(username);
     setCurrentPage(0);
     setError(null);
     await loadLogs(0, username);  
 };

 const animateLogs = (logData: SystemLogResponse) => {
   const totalLogs = logData.reduce((sum, dateGroup) => sum + dateGroup.logs.length, 0);
   let currentIndex = 0;

   const interval = setInterval(() => {
     if (currentIndex >= totalLogs) {
       clearInterval(interval);
       return;
     }

     setVisibleIndexes(prev => [...prev, currentIndex]);
     currentIndex++;
   }, 100);

   return () => clearInterval(interval);
 };


 const handlePageChange = (page: number) => {
    if (page > 0 && (hasMoreData || page <= currentPage + 1)) {
        setCurrentPage(page - 1);
        loadLogs(page - 1);
    }
};

 const getGlobalIndex = (dateIndex: number, logIndex: number) => {
   let globalIndex = 0;
   for (let i = 0; i < dateIndex; i++) {
     globalIndex += logs[i].logs.length;
   }
   return globalIndex + logIndex;
 };

 return (
   <div className={styles.container}>
     <div className={styles.header}>
       <div className={styles.headerLeft}>
         <h6>System Log</h6>
         <p>Actions done by admins</p>
       </div>
       <Filter 
         userNames={userNames || []}
         onFilterChange={handleFilterChange}
       />
     </div>
     
     {loading ? (
       <div className={styles.loaderContainer}>
         <LottieLoader size={"180px"} />
       </div>
     ) : error ? (
       <div className={styles.error}>{error}</div>
     ) : (
       <div className={styles.content}>
         {logs.length > 0 ? (
           logs.map((dateGroup, dateIndex) => (
             <div key={dateGroup.date} className={styles.dateGroup}>
               <h3 className={styles.dateHeading}>
                 {new Date(dateGroup.date).toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'   
                 })}
               </h3>
               {dateGroup.logs.map((log, logIndex) => {
                 const globalIndex = getGlobalIndex(dateIndex, logIndex);
                 return (
                   <div
                     key={`${dateGroup.date}-${logIndex}`}
                     className={`${styles.logItem} ${
                       visibleIndexes.includes(globalIndex) ? styles.visible : ""
                     }`}
                   >
                     <span className={styles.time}>
                       {new Date(`2000-01-01T${log.time}`).toLocaleTimeString('en-US', {
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </span>
                     <div className={styles.circle}></div>
                     <div className={styles.spaceAfterCircle}></div>
                     <span className={styles.text}>{log.description}</span>
                     {logIndex < dateGroup.logs.length - 1 && (
                       <div className={styles.line}></div>
                     )}
                   </div>
                 );
               })}
             </div>
           ))
         ) : (
           <div className={styles.noLogsMessage}>No logs available</div>
         )} 
       </div>
     )}

    {logs.length > 0 && (
        <div className={styles.paginationContainer}>
            <Pagination
                currentPage={currentPage + 1}
                totalPages={hasMoreData ? currentPage + 2 : currentPage + 1}
                onPageChange={handlePageChange}
            />
        </div>
     )}
   </div>
 );
};

export default SystemLogPage;