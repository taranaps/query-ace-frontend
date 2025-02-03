/**
 * @module SystemLogPage
 * @description 
 * A comprehensive React component that displays system activity logs in a timeline format.
 * This component serves as an admin dashboard showing all system activities chronologically.
 * Features include:
 * - Secure authentication checking to protect sensitive log data 
 * - Timeline visualization with dates and times of actions
 * - Filtering capability to view specific admin's activities
 * - Pagination for handling large volumes of log data
 * - Animated log entry display for better user experience
 * - Error handling for network issues and authentication failures
 * - Loading states with animated indicators
 * - Responsive design for various screen sizes
 * 
 * Security Note: Component requires valid authentication token and handles
 * unauthorized access by redirecting to login.
 */
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

/**
 * @constant {number} DATES_PER_PAGE
 * @description
 * Controls the pagination by defining how many dates of logs appear on one page.
 * When the number of date groups exceeds this value, pagination controls become active.
 * This helps manage memory and performance by limiting the amount of data displayed at once.
 */
const DATES_PER_PAGE = 10;

/**
 * @component SystemLogPage
 * @description
 * The main system log component that orchestrates the display of admin activities.
 * It manages multiple states:
 * - Authentication state for secure access
 * - Loading states during data fetching
 * - Error states for various failure scenarios
 * - Filtered views based on selected admin
 * - Pagination state for navigating through logs
 * - Animation states for smooth log entry display
 * 
 * The component automatically loads initial data and handles:
 * - User authentication
 * - Data fetching and error handling
 * - Admin filtering
 * - Pagination
 * - Timeline display with animations
 * 
 * @security Requires valid authentication token
 * @performance Uses pagination and lazy loading for efficient data handling
 */
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

 /**
  * @function useEffect
  * @description
  * Initial setup effect that runs when component mounts or when dependencies change.
  * Handles three main tasks:
  * 1. Authentication check - Ensures user has valid access
  * 2. User data loading - Fetches admin names for filtering
  * 3. Initial log loading - Loads first page of log data
  * 
  * Security Features:
  * - Checks for valid user session
  * - Verifies authentication token
  * - Redirects unauthorized access to login
  * 
  * Error Handling:
  * - Catches and logs user data fetching errors
  * - Maintains app stability during fetch failures
  * 
  * @dependencies [user, token, router] - Reruns when these values change
  */
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

 /**
  * @function loadLogs
  * @description
  * Core function that handles fetching and displaying log data.
  * Manages both all-logs and user-specific log fetching with comprehensive error handling.
  * 
  * Key Features:
  * - Supports both filtered and unfiltered log fetching
  * - Handles pagination boundaries
  * - Manages loading states
  * - Handles various error scenarios
  * - Triggers log animation on successful load
  * 
  * Error Handling:
  * - 404 errors for no data scenarios
  * - Authentication failures (401)
  * - Network errors
  * - Invalid user selections
  * 
  * State Management:
  * - Updates loading state
  * - Manages pagination states
  * - Controls data visibility
  * - Updates error states
  * 
  * @param {number} pageNumber - Target page to load (0-based index)
  * @param {string|null} userToLoad - Username to filter by, null for all logs
  * @returns {Promise<void>}
  * 
  * @throws Redirects to login on authentication failure
  */
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
 
 /**
  * @function handleFilterChange
  * @description
  * Manages admin filtering functionality allowing users to view logs for specific admins.
  * 
  * Key Operations:
  * 1. Updates selected admin state
  * 2. Resets pagination to first page
  * 3. Clears any existing errors
  * 4. Triggers new log fetch with filter
  * 
  * State Updates:
  * - Selected user filter
  * - Current page reset
  * - Error state cleared
  * 
  * @param {string|null} username - Admin username to filter by, null for all logs
  * @returns {Promise<void>}
  */
 const handleFilterChange = async (username: string | null) => {
     setSelectedUser(username);
     setCurrentPage(0);
     setError(null);
     await loadLogs(0, username);  
 };

 /**
  * @function animateLogs
  * @description
  * Creates a smooth animation effect where log entries appear sequentially.
  * Uses a timer-based approach to gradually reveal logs for better user experience.
  * 
  * Animation Details:
  * - Calculates total logs across all date groups
  * - Shows one new log every 100ms
  * - Handles cleanup to prevent memory leaks
  * 
  * Implementation Notes:
  * - Uses setInterval for timing
  * - Updates visibleIndexes state for controlled rendering
  * - Includes cleanup function for component unmount
  * 
  * @param {SystemLogResponse} logData - Log data to animate
  * @returns {Function} Cleanup function to clear interval
  */
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

 /**
  * @function handlePageChange
  * @description
  * Manages pagination interactions and data loading for different pages.
  * Includes validation to prevent navigation to non-existent pages.
  * 
  * Features:
  * - Validates page boundaries
  * - Handles data loading for new pages
  * - Updates current page state
  * - Considers has-more-data flag
  * 
  * @param {number} page - Target page number (1-based index)
  */
 const handlePageChange = (page: number) => {
    if (page > 0 && (hasMoreData || page <= currentPage + 1)) {
        setCurrentPage(page - 1);
        loadLogs(page - 1);
    }
};

 /**
  * @function getGlobalIndex
  * @description
  * Calculates the absolute position of a log entry across all date groups.
  * Used for animation timing and ensuring correct order of log appearance.
  * 
  * Calculation Method:
  * 1. Sums up logs in all previous date groups
  * 2. Adds the index within current date group
  * 
  * Use Cases:
  * - Animation sequencing
  * - Unique key generation
  * - Log order tracking
  * 
  * @param {number} dateIndex - Index of the date group
  * @param {number} logIndex - Index of log within its date group
  * @returns {number} Absolute index in complete log list
  */
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