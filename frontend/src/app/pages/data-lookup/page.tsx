'use client';

import { useState, useEffect } from "react";
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard"; 
import Pagination from "@/app/components/pagination/Pagination";
import styles from "./datalookup.module.css";
import DataPopup from "@/app/components/data-popup/DataPopup";
import fetchQueriesQuestions from "@/app/api/questioncard/fetchQueriesQuestions";
import fetchQueryWithAnswers from "@/app/api/questioncard/fetchQueryAnswers";

export default function QueryLookup() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const itemsPerPage = 10; 

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

  const handleCardClick = async (item: any) => {
    setSelectedItem(item);
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
        {paginatedData.map((item, index) => (
          <DataCardDashboard
            key={item.id}
            id={item.id}
            question={item.question || "No question provided"}
            answer={item.answer || "No answer provided"}
            customer={item.customer || "Unknown"} 
            createdBy={item.usersUsername || "Unknown"}
            createdAt={item.createdAt || "Unknown"}
            tags={(item.tags || [])}
            editOn={true} 
            deleteOn={true} 
            copyOn={true} 
            onEdit={(id, newQuestion, newAnswer) => { console.log(id, newQuestion, newAnswer); }}
            onDelete={() => handleDelete(index)}
            onClick={() => handleCardClick(item)}
          />
        ))}
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
          onDelete={() => { }}
          onEdit={() => { }}
        />
      )}
    </div>
  );
}
