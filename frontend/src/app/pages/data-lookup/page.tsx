'use client';

import { useState, useEffect } from "react";
import DataCardWithQuestions from "@/app/components/datacard-with-question/dataCardWithQuestion";
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
  const [answers, setAnswers] = useState<any[]>([]); // Store answers separately
  const itemsPerPage = 10; // Items per page

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

  // Paginate data
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


      const fetchedData = await fetchQueryWithAnswers(1);
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
      {/* Header */}
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Query Lookup</h2>
      </div>

      {/* Data Display */}
      <div className={styles.dataItems}>
        {paginatedData.map((item, index) => (
          <DataCardWithQuestions
            key={item?.id || index} // Use a unique ID if available
            question={item.question || "No question provided"}
            createdBy={item.usersUsername || "Unknown"}
            tags={(item.tags || []).map(
              (tag: any) => `${tag.tagGroup || "Group"}: ${tag.tagName || "Tag"}`
            )} // Ensure tags is an array of strings
            id={item?.id || index}
            onEdit={() => { /* Add edit functionality if required */ }}
            copyOn={true}
            editOn={true}
            deleteOn={true}
            onDelete={() => handleDelete(index)}
            onClick={() => handleCardClick(item)} // Handle card click
          />
        ))}
      </div>

      {/* Pagination */}
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

      {/* Popup */}
      {isPopupOpen && selectedItem && (
        <DataPopup
          data={{
            ...selectedItem,
            answers: answers, // Pass the fetched answers to the popup
            tags: selectedItem.tags || [], // Provide a default empty array for tags
          }}
          onClose={() => {
            setIsPopupOpen(false);
            setAnswers([]); // Clear answers when popup closes
          }}
        />
      )}
    </div>
  );
}
