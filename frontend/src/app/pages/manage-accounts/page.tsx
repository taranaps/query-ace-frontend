'use client';

import React, { useState, useEffect } from "react";
import SearchBar from "../../components/search-bar/SearchBar";
import SortFilterButton from "../../components/sort-filter-button/SortFilterButton";
import TableWrapper from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import AddAdminPopup from "../../components/add-admin-popup/AddAdminPopup";
import AdminTogglePopup from "../../components/admin-toggle-popup/AdminTogglePopup";
import { fetchUserInterface } from "@/app/interface/user/fetchUserInterface";

import styles from "./ManageAccountsPage.module.css";

const ManageAccountsPage: React.FC = () => {

    const [userData, setUserData] = useState<fetchUserInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "earliest">("newest");
    const [openAddPopup, setOpenAddPopup] = useState(false);
    const [openTogglePopup, setOpenTogglePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/admin/users")
                const result = await response.json();
                console.log(result);
                
                if (Array.isArray(result)) {
                    setUserData(result);
                } else {
                    console.error('Fetched data is not an array:', result);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, []);

    const handleToggleStatus = (email: string) => {
        setSelectedEmail(email);
        setOpenTogglePopup(true);
    };

    const confirmToggleStatus = async () => {
        if (selectedEmail) {
            const userToUpdate = userData.find((item) => item.email === selectedEmail);

            if (userToUpdate) {
                const updatedStatus: "ACTIVE" | "INACTIVE" = !userToUpdate.isActive ? "ACTIVE" : "INACTIVE";

                try {
                    const url = `/api/admin/toggle-status/${userToUpdate.id}`.trim();

                    console.log(url);


                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            isActive: !userToUpdate.isActive,
                            status: updatedStatus,
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        const updatedData = userData.map((item) =>
                            item.email === selectedEmail ? { ...item, isActive: !item.isActive, status: updatedStatus } : item
                        );
                        setUserData(updatedData);
                    } else {
                        console.error('Failed to update user status', result);
                    }
                } catch (error) {
                    console.error('Error updating user status:', error);
                }
            }
        }

        setOpenTogglePopup(false);
        setSelectedEmail(null);
    };

    const handleAddAdmin = async (adminData: {
        firstName: string;
        email: string;
        location: string;
        username: string;
        password: string;
        userRole: "SUPER_ADMIN" | "ADMIN";
    }) => {
        try {
            const url = `/api/admin/create`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });

            console.log(JSON.stringify(adminData));
            

            if (response.ok) {
                const result = await response.json();
                console.log('New admin created successfully:', result);
                setOpenAddPopup(false);
            } else {
                const errorResult = await response.json();
                console.error('Failed to create admin:', errorResult);
                alert(`Error: ${errorResult.message || 'Failed to create admin.'}`);
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            alert('An unexpected error occurred while creating the admin.');
        }
    };

    const handleAddAccount = () => setOpenAddPopup(true);
    const handleCloseAddPopup = () => setOpenAddPopup(false);
    const handleCloseTogglePopup = () => setOpenTogglePopup(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
    const handlePageChange = (page: number) => setCurrentPage(page);

    const sortedData = [...userData].sort((a, b) => {
        const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return sortOrder === "newest" ? timestampB - timestampA : timestampA - timestampB;
    });

    const filteredData = sortedData.filter(
        (item) =>
            item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>All Accounts</h1>
                <div className={styles.searchSortContainer}>
                    <SearchBar onChange={handleSearchChange} />
                    <SortFilterButton
                        sortOrder={sortOrder}
                        onSortChange={(newOrder) => setSortOrder(newOrder)}
                    />
                </div>
            </div>

            <div className={styles.tableData}>
                <TableWrapper
                    data={paginatedData}
                    onToggleStatus={(email) => handleToggleStatus(email)}
                    headerClassName={styles.tableHeader}
                    rowClassName={styles.tableRow}
                />
            </div>

            <div className={styles.footer}>
                <div className={styles.paginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                    <div className={styles.itemRange}>
                        <p>
                            Displaying {startItem}–{endItem} of {filteredData.length} accounts
                        </p>
                    </div>
                </div>
                <button className={styles.addAccountButton} onClick={handleAddAccount}>
                    + Add Account
                </button>
            </div>
            {openAddPopup && <AddAdminPopup
                onConfirm={handleAddAdmin}
                onClose={handleCloseAddPopup} />}
            {openTogglePopup && (
                <AdminTogglePopup
                    onConfirm={confirmToggleStatus}
                    onClose={handleCloseTogglePopup}
                />
            )}
        </div>
    );
};

export default ManageAccountsPage;
