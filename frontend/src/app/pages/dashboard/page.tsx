"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard";
import styles from "./dashboard.module.css";
import searchQueryResult from "@/app/interface/query/searchQueryResult";
import fetchQueryUsingKeyword from "@/app/api/queries/fetchQueryUsingKeyword";
import DataPopup from "@/app/components/data-popup/DataPopup";
import fetchQueryWithAnswers from "@/app/api/questioncard/fetchQueryAnswers";
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<searchQueryResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [popupSize, setPopupSize] = useState<{ width: number; height: number }>({ width: 60, height: 20 });

  const handleCardClick = async (event: React.MouseEvent<HTMLElement>, item: searchQueryResult) => {
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
      setAnswers(fetchedData?.answers || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
      setAnswers([]);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchKeyword.trim()) {
        setIsLoading(true);
        fetchQueryUsingKeyword(searchKeyword)
          .then((data) => setSearchResults(data))
          .catch((error) => console.error("Error fetching search results:", error))
          .finally(() => setIsLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchKeyword]);

  const clearSearch = () => setSearchKeyword("");

  const renderContent = () => {
    if (isLoading || !user) {
      return (
        <div className={styles.loaderContainer}>
          <LottieLoader size={180} />
        </div>
      );
    }

    if (!searchKeyword) {
      return (
        <div className={styles["image-placeholder"]}>
          <img src="/assets/images/dashboard-clipboard.png" alt="No Results" />
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className={styles["image-placeholder"]}>
          <p>No answers found</p>
          <br />
          <a onClick={() => router.push("/pages/add-record")}>Add new data?</a>
        </div>
      );
    }

    return searchResults.map((result, index) => (
      <div className={styles.dataItem} key={result.id}>
        <DataCardDashboard
          key={result.id}
          id={result.id}
          question={result.question}
          customer={"Customer"}
          createdBy={result.usersUsername}
          createdAt={result.queryCreatedAt}
          answer={result.answers[0]?.answer || "No Answer"}
          numberOfAnswers={result.answers.length}
          tags={result.tags}
          deleteOn={true}
          copyOn={true}
          onClick={(e) => handleCardClick(e, result)}
        />
        {index < searchResults.length - 1 && <div className={styles.divider}></div>}
      </div>

    ));
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-search-bar"]}>
        <img src="/assets/icons/cross-grey-icon.png" alt="Clear" onClick={clearSearch} />
        <input
          placeholder="Search..."
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <img src="/assets/icons/search-grey-icon.png" alt="Search" />
      </div>

      <div className={styles["dashboard-body"]}>{renderContent()}</div>

      {isPopupOpen && selectedItem && (
        <DataPopup
          data={{ ...selectedItem, answers, tags: selectedItem.tags || [] }}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedItem(null);
            setAnswers([]);
          }}
          user={user}
          position={popupPosition}
          size={popupSize}
        />
      )}
    </div>
  );
};

export default Dashboard;
