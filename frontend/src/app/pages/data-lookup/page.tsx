'use client';

import { useState, useEffect, useRef } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard";
import Pagination from "@/app/components/pagination/Pagination";
import styles from "./datalookup.module.css";
import DataPopup from "@/app/components/data-popup/DataPopup";
import fetchQueriesQuestions from "@/app/api/questioncard/fetchQueriesQuestions";
import fetchQueryWithAnswers from "@/app/api/questioncard/fetchQueryAnswers";
import { handleCopyQuery } from "@/app/util/query/queryFunctionalities";
import Lottie from 'lottie-react'; // Import Lottie
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";

export default function QueryLookup() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerPage = 10;

  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [popupSize, setPopupSize] = useState<{ width: number; height: number }>({ width: 60, height: 20 });


  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === 'INACTIVE') {
      router.push('/pages/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchQueriesQuestions();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleDelete = (index: number) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleCardClick = async (event: React.MouseEvent<HTMLElement>, item: any) => {
    setSelectedItem(item);

    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPopupSize({
      width: rect.width,
      height: rect.height,
    });

    setIsPopupOpen(true);

    try {
      const fetchedData = await fetchQueryWithAnswers(item.id);
      if (fetchedData && fetchedData.answers) {
        setAnswers(fetchedData.answers);
      } else {
        console.warn("No answers found for this query.");
        setAnswers([]);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      setAnswers([]);
    }
  };

  return (
    <div className={styles.dataLookupContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Query Lookup</h2>
      </div>

      <div className={styles.dataItems}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <LottieLoader size={"180px"} />
          </div>
        ) : (
          paginatedData.map((item, index) => (
            <div className={styles.dataItem} key={item.id}>
              <DataCardDashboard
                key={item.id}
                id={item.id}
                question={item.question || "No question provided"}
                answer={item.answer || "No answer provided"}
                customer={item.customer || "Unknown"}
                createdBy={item.usersUsername || "Unknown"}
                createdAt={item.createdAt || "Unknown"}
                tags={item.tags || []}
                deleteOn={true}
                copyOn={Boolean(item.answer)}
                onClick={(e) => handleCardClick(e, item)}
              />
              {index < paginatedData.length - 1 && <div className={styles.divider}></div>}
            </div>

          ))
        )}
      </div>

      <div className={styles.paginationContainer}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <div className={styles.itemRange}>
          <p>
            Displaying {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} items
          </p>
        </div>
      </div>

      {isPopupOpen && selectedItem && (
        <DataPopup
          data={{
            ...selectedItem,
            answers: answers,
            tags: selectedItem.tags || [],
          }}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedItem(null);
            setAnswers([]);
          }}
          position={popupPosition}
          size={popupSize}
        />
      )}
    </div>
  );
}
