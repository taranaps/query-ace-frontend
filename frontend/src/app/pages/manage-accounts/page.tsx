// src/app/pages/manage-accounts/page.tsx
"use client";

import React, { useState } from "react";
// import { Box, Typography, Button, Grid2 } from "@mui/material";
import SearchBar from "../../components/search-bar/SearchBar";
import SortFilterButton from "../../components/sort-filter-button/SortFilterButton";
import TableWrapper from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import AddAdminPopup from "../../components/add-admin-popup/AddAdminPopup";

const initialData: {
    name: string;
    email: string;
    location: string;
    status: "Active" | "Inactive";
    isActive: boolean;
    timestamp: Date;
}[] = [
        { name: "Jane Cooper", email: "jane@microsoft.com", location: "Kochi", status: "Active", isActive: true, timestamp: new Date("2023-12-01T10:00:00") },
        { name: "Floyd Miles", email: "floyd@yahoo.com", location: "Trivandrum", status: "Inactive", isActive: false, timestamp: new Date("2023-11-28T15:00:00") },
        { name: "Ronald Richards", email: "ronald@adobe.com", location: "Bangalore", status: "Inactive", isActive: false, timestamp: new Date("2023-12-02T08:30:00") },
        { name: "Marvin McKinney", email: "marvin@tesla.com", location: "Trivandrum", status: "Active", isActive: true, timestamp: new Date("2023-11-30T12:00:00") },
        { name: "Esther Howard", email: "esther@facebook.com", location: "Mumbai", status: "Active", isActive: true, timestamp: new Date("2023-12-01T09:00:00") },
        { name: "Cody Fisher", email: "cody@google.com", location: "Chennai", status: "Inactive", isActive: false, timestamp: new Date("2023-11-29T14:00:00") },
        { name: "Savannah Nguyen", email: "savannah@amazon.com", location: "Delhi", status: "Active", isActive: true, timestamp: new Date("2023-12-03T11:30:00") },
        { name: "Dianne Russell", email: "dianne@uber.com", location: "Hyderabad", status: "Inactive", isActive: false, timestamp: new Date("2023-12-02T10:45:00") },
        { name: "Jacob Jones", email: "jacob@apple.com", location: "Kolkata", status: "Active", isActive: true, timestamp: new Date("2023-11-30T13:15:00") },
        { name: "Kristin Watson", email: "kristin@netflix.com", location: "Pune", status: "Inactive", isActive: false, timestamp: new Date("2023-12-03T08:15:00") },
        { name: "Michael Scott", email: "michael@dundermifflin.com", location: "Scranton", status: "Active", isActive: true, timestamp: new Date("2023-12-01T16:00:00") },
        { name: "Pam Beesly", email: "pam@dundermifflin.com", location: "Scranton", status: "Active", isActive: true, timestamp: new Date("2023-12-02T17:30:00") },
        { name: "Jim Halpert", email: "jim@dundermifflin.com", location: "Scranton", status: "Active", isActive: true, timestamp: new Date("2023-12-02T18:45:00") },
        { name: "Dwight Schrute", email: "dwight@dundermifflin.com", location: "Scranton", status: "Inactive", isActive: false, timestamp: new Date("2023-12-03T19:15:00") },
    ];

const ManageAccountsPage: React.FC = () => {
    const [data, setData] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "earliest">("newest");
    const [openPopup, setOpenPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleToggleStatus = (email: string, newStatus: boolean) => {
        const updatedData = data.map((item) => {
            if (item.email === email) {
                const updatedStatus: "Active" | "Inactive" = newStatus ? "Active" : "Inactive";
                return { ...item, isActive: newStatus, status: updatedStatus };
            }
            return item;
        });
        setData(updatedData); // Update the table data
    };

    const handleAddAccount = () => setOpenPopup(true);
    const handleClosePopup = () => setOpenPopup(false);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
    const handlePageChange = (page: number) => setCurrentPage(page);

    const sortedData = [...data].sort((a, b) =>
        sortOrder === "newest"
            ? b.timestamp.getTime() - a.timestamp.getTime()
            : a.timestamp.getTime() - b.timestamp.getTime()
    );

    const filteredData = sortedData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
            <div className="bg-white p-6 space-y-8 h-full flex-grow">
                {/* First Section: Title, Search, Sort Filter */}
                <div className="flex">
                    <h1 className="text-black text-[22px] font-semibold flex-grow">All Accounts</h1>
                    <div className="flex space-x-2">
                        <SearchBar
                            onChange={handleSearchChange}
                            sx={{
                                width: "216px",
                                height: "40px",
                                backgroundColor: "#F9FBFF",
                                borderColor: "F9FBFF",
                                borderRadius: "10px",
                                marginLeft: 0,
                                "&:focus": {
                                    backgroundColor: "#FCF4E7",
                                    outline: "2px solid #FF9500",
                                    borderColor: "#FF9500", // Ensures focus state is same as hover
                                },
                                "&:hover": {
                                    backgroundColor: "#FFEBD8", // Orangeish background
                                    borderColor: "#FF9500", // Consistent hover border
                                },
                                color: "#7E7E7E",
                            }} />
                        <SortFilterButton
                            sortOrder={sortOrder}
                            onSortChange={(newOrder: "newest" | "earliest") => setSortOrder(newOrder)}
                            sx={{
                                width: "216px",
                                height: "40px",
                                borderRadius: "10px", // Same corner radius for Sort button
                                marginLeft: 0,
                            }} />
                    </div>
                </div>
                {/* Second Section: Table */}
                <div>
                    <TableWrapper
                        data={paginatedData}
                        onToggleStatus={(email, newStatus) => handleToggleStatus(email, newStatus)}
                        sx={{
                            border: "none",
                            "& .MuiTableCell-root": {
                                fontSize: "14px",
                                color: "#B5B7C0",
                            },
                        }}
                        // className="border-none divide-y divide-[#EEEEEE]"
                        headerClassName="text-[#B5B7C0] font-medium text-[14px]"
                        rowClassName="text-[#292D32] font-medium text-[14px]"
                    />
                </div>
                {/* Third Section: Pagination and Add Account */}
                <div className="flex justify-between">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                    <button
                        className="bg-[#3070A4] text-white px-6 py-2 rounded-lg h-[44px] w-[150px] text-sm"
                        onClick={handleAddAccount}
                    >
                        + Add Account
                    </button>
                </div>
                {/* Popup */}
                {openPopup && <AddAdminPopup onClose={handleClosePopup} />}
            </div>
    );
};

export default ManageAccountsPage;