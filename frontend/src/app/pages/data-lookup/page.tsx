"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard";
import Pagination from "@/app/components/pagination/Pagination";
import styles from "./datalookup.module.css";
import DataPopup from "@/app/components/data-popup/DataPopup";
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";
import { fetchCreatedByUsers } from "@/app/api/companies/fetchCreatedByUsers";
import FilterDropdown from "@/app/components/lookup-filterdropdown/FilterDropDown";
import { fetchAllTagsWithDetails } from "@/app/util/tags/tagFunctionalities";
import { handleFilterQuery } from "@/app/util/query/queryFunctionalities";
interface QueryItem {
  id: string;
  createdAt?: string;
  usersUsername?: string;
  question: string;
  answers: Array<{ answer: string }>;
  customer?: string;
  queryCreatedAt?: string;
  tags?: string[];
}
const QueryLookup = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [createdBy, setCreatedBy] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [sortOrder] = useState<"newest" | "earliest">("newest");

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([]);
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string[] }[]>([]);

  const itemsPerPage = 10;
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [popupSize, setPopupSize] = useState<{ width: number; height: number }>({ width: 60, height: 20 });

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const createdByResult = await fetchCreatedByUsers();
        if (Array.isArray(createdByResult)) setCreatedBy(createdByResult);

        const tags = await fetchAllTagsWithDetails();
        setTagGroups(tags);

        const filteredQueriesResponse = await handleFilterQuery(selectedCreatedBy, selectedCompanies);

        if (filteredQueriesResponse.success) {
          const formattedData = filteredQueriesResponse.data.map((item: QueryItem)=> ({
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Unknown",
            usersUsername: item.usersUsername || "Unknown"
          }));
          setData(filteredQueriesResponse.data);
          setFilteredData(filteredQueriesResponse.data);
        } else {
          console.error("Failed to fetch filtered queries:", filteredQueriesResponse.message);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompanies, selectedCreatedBy]);

  const handleFilterChange = async() => {
    setLoading(true);
    const filteredQueries = await handleFilterQuery(selectedCompanies, selectedCreatedBy);
    setFilteredData(filteredQueries.data);
    setLoading(false);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const timestampA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timestampB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (isNaN(timestampA)) return 1;
    if (isNaN(timestampB)) return -1;

    return sortOrder === "newest" ? timestampB - timestampA : timestampA - timestampB;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleCardClick = async(event: React.MouseEvent<HTMLElement>, item: any) => {
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
  };

  return (
    <div className={styles.dataLookupContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Query Lookup</h2>
      </div>

      <div className={styles.filtersRow}>
        <FilterDropdown
          label="Filter by Tags"
          tagGroups={tagGroups}
          selectedOptions={selectedCompanies}
          onChange={(selected) => {
            setSelectedCompanies(selected);
            handleFilterChange();
          }}
        />

        <FilterDropdown
          label="Filter by Account"
          options={createdBy}
          selectedOptions={selectedCreatedBy}
          onChange={(selected) => {
            setSelectedCreatedBy(selected);
            handleFilterChange();
          }}
        />
      </div>

      <div className={styles.dataItems}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <LottieLoader size={"180px"}  state="Loading"/>
          </div>
        ) : (
          paginatedData.map((item) => (
            <div className={styles.dataItem} key={item.id}>
              <DataCardDashboard
                {...item}
                id={item.id}
                question={item.question || "No question provided"}
                answer={item.answers[0]?.answer || "No answer provided"}
                createdBy={item.usersUsername || "Unknown"}
                createdAt={item.queryCreatedAt || "Unknown"}
                tags={item.tags || []}
                deleteOn={true}
                copyOn={Boolean(item.answer)}
                onClick={(e) => handleCardClick(e, item)}
                numberOfAnswers={item.answers.length}
              />
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
            Displaying {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, data.length)} of {data.length} items
          </p>
        </div>
      </div>

      {isPopupOpen && selectedItem && (
        <DataPopup
          id={selectedItem.id}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedItem(null);
          }}
          position={popupPosition}
          size={popupSize}
          user={user}
        />
      )}
    </div>
  );
};

export default QueryLookup;
