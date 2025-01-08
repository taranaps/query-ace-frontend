
'use client'
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard";
import Pagination from "@/app/components/pagination/Pagination";
import styles from "./datalookup.module.css";
import DataPopup from "@/app/components/data-popup/DataPopup";
import fetchQueriesQuestions from "@/app/api/questioncard/fetchQueriesQuestions";
import fetchQueryWithAnswers from "@/app/api/questioncard/fetchQueryAnswers";
import { handleCopyQuery } from "@/app/util/query/queryFunctionalities";
import Lottie from 'lottie-react'; 
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";
import { fetchCompanies } from "@/app/api/companies/fetchCompanies"; 
import { fetchCreatedByUsers } from "@/app/api/companies/fetchCreatedByUsers"; 
import Filter from "@/app/components/filter/filter"; 
import SortFilterButton from "@/app/components/sort-filter-button/SortFilterButton";

export default function QueryLookup() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<string[]>([]); 
  const [createdBy, setCreatedBy] = useState<string[]>([]); 
  const [filteredData, setFilteredData] = useState<any[]>([]); 
  const [sortOrder, setSortOrder] = useState<"newest" | "earliest">("newest"); 

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

  // Fetch companies on page load
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const result = await fetchCompanies();
        if (Array.isArray(result)) {
          setCompanies(result); 
        } else {
          console.error("Invalid data format for companies:", result);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompaniesData();
  }, []);


  useEffect(() => {
    const fetchCreatedByData = async () => {
      try {
        const result = await fetchCreatedByUsers();
        if (Array.isArray(result)) {
          setCreatedBy(result); 
        } else {
          console.error("Invalid data format for createdBy:", result);
        }
      } catch (error) {
        console.error("Error fetching createdBy:", error);
      }
    };

    fetchCreatedByData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchQueriesQuestions();
        if (Array.isArray(result)) {
          setData(result);
          setFilteredData(result); 
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


  const handleFilterChange = (selectedCompanies: string[], selectedCreatedBy: string[]) => {
    let filtered = data;

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(item => selectedCompanies.includes(item.company));
    }

    if (selectedCreatedBy.length > 0) {
      filtered = filtered.filter(item => selectedCreatedBy.includes(item.createdBy));
    }

    setFilteredData(filtered);
  };

 
  const sortedData = [...filteredData].sort((a, b) => {
    const timestampA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timestampB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortOrder === "newest" ? timestampB - timestampA : timestampA - timestampB;
  });

  
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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

      {/* Filters Section */}
      <div className={styles.filtersRow}>
        {/* Filter for Companies */}
        <Filter
          label="Company"
          admins={companies}
          onFilterChange={(selectedCompanies) => handleFilterChange(selectedCompanies, createdBy)}
        />

        {/* Filter for Created By */}
        <Filter
          label="Created By"
          admins={createdBy}
          onFilterChange={(selectedCreatedBy) => handleFilterChange(companies, selectedCreatedBy)}
        />

        {/* Sort and Filter Button */}
        <SortFilterButton
          sortOrder={sortOrder}
          onSortChange={(order) => setSortOrder(order)}
        />
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
                onClick={(e) => handleCardClick(e, item)} numberOfAnswers={0}              />
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
            Displaying {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, data.length)} of {data.length} items
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
