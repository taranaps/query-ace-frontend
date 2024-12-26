'use client';

import { useState } from "react";
import DataCardDashboard from "@/app/components/dashboard-datacard/DataCardDashboard";
import FilterDropdown from "@/app/components/lookup-filterdropdown/FilterDropDown";
import Pagination from "@/app/components/pagination/Pagination";
import styles from "./datalookup.module.css";

const dummyData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  customer: ["Accenture", "Microsoft", "Google", "TCS"][i % 4],
  createdBy: ["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  text: `Query ${i + 1} from ${["Accenture", "Microsoft", "Google", "TCS"][i % 4]}`,
  description: `This is a detailed description of Query ${i + 1}.`,
}));

export default function QueryLookup() {
  const [data, setData] = useState(dummyData);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10; // Number of items per page

  const filteredData = data.filter(
    (item) =>
      (selectedCustomers.length === 0 ||
        selectedCustomers.includes(item.customer)) &&
      (selectedCreators.length === 0 || selectedCreators.includes(item.createdBy))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Paginate the data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleEdit = (id: number) => {
    const newText = prompt("Edit the text for this item:");
    if (newText) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, text: newText } : item
        )
      );
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  return (
    <div className={styles.dataLookupContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Query Lookup</h2>
        <div className={styles.filterContainer}>
          <FilterDropdown
            label="Filter by Customer"
            options={["Accenture", "Microsoft", "Google", "TCS"]}
            selectedOptions={selectedCustomers}
            onChange={(selected) => setSelectedCustomers(selected)}
          />
          <FilterDropdown
            label="Filter by Creator"
            options={["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson"]}
            selectedOptions={selectedCreators}
            onChange={(selected) => setSelectedCreators(selected)}
          />
          <select
            className={styles.sortDropdown}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
      </div>

      {/* Data Content */}
      <div className={styles.dataItems}>
        {paginatedData.map((item) => (
          <DataCardDashboard
            key={item.id}
            id={item.id}
            text={item.text}
            description={item.description}
            customer={item.customer}
            createdAt={item.createdAt}
            createdBy={item.createdBy}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

        {/* Display Item Range */}
        <div className={styles.itemRange}>
          <p>
            Displaying {startItem}–{endItem} of {sortedData.length} items
          </p>
        </div>
      </div>
    </div>
  );
}
