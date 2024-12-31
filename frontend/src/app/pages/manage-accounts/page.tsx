'use client';

import React, { useState } from "react";
import SearchBar from "../../components/search-bar/SearchBar";
import SortFilterButton from "../../components/sort-filter-button/SortFilterButton";
import TableWrapper from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import AddAdminPopup from "../../components/add-admin-popup/AddAdminPopup";
import AdminTogglePopup from "../../components/admin-toggle-popup/AdminTogglePopup";

import styles from "./ManageAccountsPage.module.css";

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
    const [openAddPopup, setOpenAddPopup] = useState(false);
    const [openTogglePopup, setOpenTogglePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const itemsPerPage = 8;

    const handleToggleStatus = (email: string) => {
        setSelectedEmail(email);
        setOpenTogglePopup(true);
    };

    const confirmToggleStatus = () => {
        if (selectedEmail) {
            const updatedData = data.map((item) => {
                if (item.email === selectedEmail) {
                    const updatedStatus: "Active" | "Inactive" = !item.isActive ? "Active" : "Inactive";
                    return { ...item, isActive: !item.isActive, status: updatedStatus };
                }
                return item;
            });
            setData(updatedData);
        }
        setOpenTogglePopup(false);
        setSelectedEmail(null);
    };

    const handleAddAccount = () => setOpenAddPopup(true);
    const handleCloseAddPopup = () => setOpenAddPopup(false);
    const handleCloseTogglePopup = () => setOpenTogglePopup(false);

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
                            Displaying {startItem}–{endItem} of {sortedData.length} accounts
                        </p>
                    </div>
                </div>
                <button className={styles.addAccountButton} onClick={handleAddAccount}>
                    + Add Account
                </button>
            </div>
            {openAddPopup && <AddAdminPopup onClose={handleCloseAddPopup} />}
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
