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
import planeanimation from "../../../../public/assets/animatedIcons/Paper Plane (1).json";
import LottieIconButton from "../../components/lottie-animated-button/LottieIconButton";




const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  const [searchKeyword, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searchQueryResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [popupSize, setPopupSize] = useState<{ width: number; height: number }>({ width: 60, height: 20 });

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchKeyword) {
        setIsLoading(true);
        fetchQueryUsingKeyword(searchKeyword)
          .then((data) => setSearchResults(data))
          .catch((error) => console.error("Error fetching search results:", error))
          .finally(() => setIsLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (!user) {
    return <LottieLoader />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-search-bar"]}>
        <img src="/assets/icons/cross-grey-icon.png" alt="Clear" onClick={() => clearSearch()} />
        <input
          placeholder="Search..."
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <img src="/assets/icons/search-grey-icon.png" alt="Search" />
      </div>

      <div className={styles["dashboard-body"]}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <LottieLoader size={"240px"} />
          </div>
        ) : (
          <div className={styles["dashboard-content"]}>
            {/* Trending Queries Section */}
            {searchKeyword === "" && (
              <div className={styles.trendingQueriesContainer}>
                <div className={styles.headingContainer}>
                  <h2 className={styles.trendingTitle}>Trending Queries</h2>
                  <div className=" Lottie">
                    <LottieIconButton
                      animationData={planeanimation}
                      label="Copy Answer"
                      onClick={() => { }}
                    />
                  </div>
                </div>



                <div className={styles.queriesContent}>
                  {/* Dummy Data for Trending Queries */}
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>How to implement JWT authentication in Node.js?</div>
                        <div className={styles.queryDate}>2025-01-01</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>150</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>What are the best practices for SEO?</div>
                        <div className={styles.queryDate}>2025-01-02</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>120</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>How to use Redux with React?</div>
                        <div className={styles.queryDate}>2025-01-03</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>100</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>What is the difference between SQL and NoSQL databases?</div>
                        <div className={styles.queryDate}>2025-01-04</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>80</div>
                  </div>
                  {/* Additional Dummy Data */}
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>How do you handle errors in JavaScript?</div>
                        <div className={styles.queryDate}>2025-01-05</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>70</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>What are the latest trends in React development?</div>
                        <div className={styles.queryDate}>2025-01-06</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>65</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>What is the best way to manage state in large React applications?</div>
                        <div className={styles.queryDate}>2025-01-07</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>50</div>
                  </div>
                  <div className={styles.queryItem}>
                    <div className={styles.queryInfo}>
                      <div className={styles.queryIcon}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className={styles.queryTitle}>What are microservices in backend development?</div>
                        <div className={styles.queryDate}>2025-01-08</div>
                      </div>
                    </div>
                    <div className={styles.queryViews}>45</div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchKeyword !== "" && searchResults.length === 0 ? (
              <div className={styles["image-placeholder"]}>
                <p>No answers found</p>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <a onClick={() => router.push("/pages/add-record")}   >Add new data?</a>
              </div>
            ) : (
              searchResults.map((result) => (
                <DataCardDashboard
                  key={result.id}
                  id={result.id}
                  question={result.question}
                  customer={"Customer"}
                  numberOfAnswers={1}
                  createdBy={result.usersUsername}
                  createdAt={result.queryCreatedAt}
                  answer={result.answers[0]?.answer || "No Answer"}
                  tags={result.tags}
                  deleteOn={true}
                  copyOn={true}
                  onClick={(e) => handleCardClick(e, result)}
                />
              ))
            )}
          </div>
        )}
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
          user={user}
          position={popupPosition}
          size={popupSize}
        />

      )}
    </div>
  );
};

export default Dashboard;