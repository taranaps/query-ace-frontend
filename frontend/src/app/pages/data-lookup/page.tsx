"use client";

import { useState } from "react";
import DataCard from "@/app/components/lookup-datacard/DataCard"; // Import DataCard
import FilterDropdown from "@/app/components/lookup-filterdropdown/FilterDropDown"; // Import FilterDropdown

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  customer: ["Accenture", "Microsoft", "Google", "TCS"][i % 4],
  createdBy: ["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  text: `Query ${i + 1} from ${["Accenture", "Microsoft", "Google", "TCS"][i % 4]}`,
  description: `This is a detailed description of Query ${i + 1}.`,
}));

export default function QueryLookup() {
  const [data, setData] = useState(dummyData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("newest");

  // States for filtering
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Filter and sort data
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
    } else if (sortBy === "alphabetical") {
      return a.text.localeCompare(b.text);
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    alert(`Deleted item with ID: ${id}`);
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
    alert(`Copied: ${text}`);
  };

  return (
    <div className="h-screen bg-gray-400 flex overflow-hidden">
      {/* Sidebar */}
      <div className="flex-none">
        {/* Insert SideNav component */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gray-100">
        {/* Header Row with Filters and Sorting */}
        <div className="flex justify-between items-center w-full max-w-4xl mb-6">
          <h2 className="text-xl font-bold">Query Lookup</h2>
          <div className="flex space-x-4">
            {/* Filter by Customer */}
            <FilterDropdown
              label="Filter by Customer"
              options={["Accenture", "Microsoft", "Google", "TCS"]}
              selectedOptions={selectedCustomers}
              onChange={(selected) => setSelectedCustomers(selected)}
            />
            {/* Filter by Creator */}
            <FilterDropdown
              label="Filter by Creator"
              options={["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson"]}
              selectedOptions={selectedCreators}
              onChange={(selected) => setSelectedCreators(selected)}
            />
            {/* Sort Options */}
            <select
              className="border rounded p-2 hover:bg-orange-100 focus:outline-none transition duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>
          </div>
        </div>

        {/* Paginated Content */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-4xl flex-grow overflow-y-auto">
          {paginatedData.map((item) => (
            <DataCard
              key={item.id}
              id={item.id}
              text={item.text}
              customer={item.customer}
              createdBy={item.createdBy}
              createdAt={item.createdAt}
              description={item.description}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 w-full max-w-4xl mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 border rounded ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
