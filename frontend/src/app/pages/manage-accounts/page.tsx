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
    ];

const ManageAccountsPage: React.FC = () => {
    const [data, setData] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "earliest">("newest");
    const [openPopup, setOpenPopup] = useState(false);

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

    return (
        <div className="p-6">
            <div className="bg-white shadow rounded-lg p-6 space-y-8">
                {/* First Section: Title, Search, Sort Filter */}
                <div className="flex items-center justify-between">
                    <h1 className="text-black text-[22px] font-semibold flex-grow">All Accounts</h1>
                    <div className="flex items-center space-x-2">
                        <SearchBar
                            onChange={handleSearchChange}
                            sx={{
                                width: "216px",
                                height: "40px",
                                backgroundColor: "#F9FBFF",
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
                        data={filteredData}
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
                <div className="flex items-center justify-between">
                    <Pagination sx={{
                        fontSize: "14px",
                        marginTop: "16px",
                    }} />
                    <button
                        className="bg-[#3070A4] text-white px-6 py-2 rounded-lg h-[44px] w-[150px] text-sm"
                        onClick={handleAddAccount}
                    >
                        + Add Account
                    </button>
                </div>
            </div>

            {/* Popup */}
            {openPopup && <AddAdminPopup onClose={handleClosePopup} />}
        </div>
    );
};

export default ManageAccountsPage;