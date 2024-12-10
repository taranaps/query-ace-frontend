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
}[] = [
        { name: "Jane Cooper", email: "jane@microsoft.com", location: "Kochi", status: "Active", isActive: true },
        { name: "Floyd Miles", email: "floyd@yahoo.com", location: "Trivandrum", status: "Inactive", isActive: false },
        { name: "Ronald Richards", email: "ronald@adobe.com", location: "Bangalore", status: "Inactive", isActive: false },
        { name: "Marvin McKinney", email: "marvin@tesla.com", location: "Trivandrum", status: "Active", isActive: true },
    ];

const ManageAccountsPage: React.FC = () => {
    const [data, setData] = useState(initialData); // State for table data
    const [openPopup, setOpenPopup] = useState(false); // State to control popup visibility

    const handleToggleStatus = (index: number, newStatus: boolean) => {
        const updatedData = [...data];
        updatedData[index].isActive = newStatus;
        updatedData[index].status = newStatus ? "Active" : "Inactive";
        setData(updatedData); // Update the table data
    };

    const handleAddAccount = () => {
        setOpenPopup(true); // Open the popup
    };

    const handleClosePopup = () => {
        setOpenPopup(false); // Close the popup
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 component="div" size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h5">All Accounts</Typography>
                </Grid2>
                <Grid2 component="div" size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <SearchBar sx={{ width: "100%" }}/>
                </Grid2>
                <Grid2 component="div" size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <SortFilterButton sx={{ width: "100%" }} />
                </Grid2>
            </Grid2>
            <TableWrapper data={data} onToggleStatus={handleToggleStatus} />
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