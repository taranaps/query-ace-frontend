// src/app/pages/manage-accounts/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Grid2 } from "@mui/material";
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
        <Box sx={{ padding: 4 }}>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 component="div" size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h5">All Accounts</Typography>
                </Grid2>
                <Grid2 component="div" size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <SearchBar sx={{ width: "100%" }} onChange={handleSearchChange} />
                </Grid2>
                <Grid2 component="div" size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: "flex-start" }}>
                <SortFilterButton
                        sx={{ width: "100%" }}
                        sortOrder={sortOrder}
                        onSortChange={(newOrder: "newest" | "earliest") => setSortOrder(newOrder)}
                    />
                </Grid2>
            </Grid2>
            <TableWrapper
                data={filteredData}
                onToggleStatus={(email, newStatus) => handleToggleStatus(email, newStatus)}
            />
            <Grid2 container justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
                <Grid2 component="div">
                    <Pagination />
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 4 }}
                        onClick={handleAddAccount} // Open popup on click
                    >
                        + Add Account
                    </Button>
                </Grid2>
            </Grid2>
            {openPopup && <AddAdminPopup onClose={handleClosePopup} />} {/* Popup component */}
        </Box>
    );
};

export default ManageAccountsPage;