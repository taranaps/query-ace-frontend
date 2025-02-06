/**
 * @fileoverview ManageAccountsPage component for managing user accounts.
 * Handles listing, searching, sorting, pagination, and CRUD operations for admin accounts.
 * 
 * @module ManageAccountsPage
 */

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search-bar/SearchBar";
import SortFilterButton from "../../components/sort-filter-button/SortFilterButton";
import TableWrapper from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import AddAdminPopup from "../../components/add-admin-popup/AddAdminPopup";
import AdminTogglePopup from "../../components/admin-toggle-popup/AdminTogglePopup";
import { fetchUserInterface } from "@/app/interface/user/fetchUserInterface";
import styles from "./ManageAccountsPage.module.css";
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";
import { handleAddAdmin } from "@/app/util/admin/adminFunctionalities";
import NewButton from "../../components/new-button/NewButton";
import { API_BASE_URL } from "@/config/apiConfig";

type AdminFormData = {
  firstName: string;
  email: string;
  username: string;
  password: string;
  userRole: "SUPER_ADMIN" | "ADMIN";
};

const ManageAccountsPage: React.FC = () => {
  const [userData, setUserData] = useState<fetchUserInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "earliest">("newest");
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openTogglePopup, setOpenTogglePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState<fetchUserInterface | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    } else if (user.role !== "SUPER_ADMIN") {
      router.back();
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
    
        if (Array.isArray(result)) {
          const validatedData = result.map(user => ({
            ...user,
            status: (user.status === "ACTIVE" || user.status === "INACTIVE") 
              ? user.status 
              : "INACTIVE",
            roles: user.roles || []
          })) as fetchUserInterface[];
          setUserData(validatedData);
        } else {
          console.error("Fetched data is not an array:", result);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleStatus = (email: string) => {
    setSelectedEmail(email);
    setOpenTogglePopup(true);
  };

  const confirmToggleStatus = async() => {
    if (selectedEmail) {
      const userToUpdate = userData.find((item) => item.email === selectedEmail);
    
      if (userToUpdate) {
        try {
          const response = await fetch(`${API_BASE_URL}/admin/toggle-status/${userToUpdate.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId: userToUpdate.id 
            })
          });
    
          if (response.ok) {
            const updatedData = userData.map((item) =>
              item.email === selectedEmail 
                ? { 
                    ...item, 
                    status: (item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE") as "ACTIVE" | "INACTIVE"
                  }
                : item
            );
            setUserData(updatedData);
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }
    }
    setOpenTogglePopup(false);
    setSelectedEmail(null);
  };

  const handleAddAccount = () => setOpenAddPopup(true);
  
  const handleEditAccount = async(id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const adminDetails = await response.json();

      if (response.ok) {
        setSelectedAdmin(adminDetails);
        setOpenEditPopup(true);
      } else {
        console.error("Failed to fetch admin details:", adminDetails);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleUpdateAdmin = async(updatedAdminData: AdminFormData) => {
    if (!selectedAdmin) return false;
  
    try {
      const response = await fetch(`${API_BASE_URL}/admin/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: selectedAdmin.id,
          ...updatedAdminData
        })
      });
  
      if (response.ok) {
        const result = await response.json();
        setUserData(userData.map((admin) => 
          admin.id === selectedAdmin.id ? { 
            ...admin, 
            ...result,
            role: result.userRole
          } : admin
        ));
        setOpenEditPopup(false);
      }
      return response.ok;
    } catch (error) {
      console.error("Error updating admin:", error);
      return false;
    }
  };

  const handleCloseAddPopup = () => setOpenAddPopup(false);
  const handleCloseEditPopup = () => setOpenEditPopup(false);
  const handleCloseTogglePopup = () => setOpenTogglePopup(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const sortedData = [...userData].sort((a, b) => {
    const timestampA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timestampB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <LottieLoader size={"180px"} state="loading" />
          </div>
        ) : (
          <TableWrapper
            data={paginatedData}
            onToggleStatus={(email) => handleToggleStatus(email)}
            onEditAdmin={(id) => handleEditAccount(id)}
            headerClassName={styles.tableHeader}
            rowClassName={styles.tableRow}
          />
        )}
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
        <NewButton
          variant="custom"
          onClick={handleAddAccount}
          width="fit"
          type="button"
        >
          + Add Account
        </NewButton>
      </div>

      {openAddPopup && (
        <AddAdminPopup
          header="Add Admin"
          onConfirm={handleAddAdmin}
          onClose={handleCloseAddPopup}
          closePopup={handleCloseAddPopup}
          passwordOn={true}
        />
      )}

      {openEditPopup && selectedAdmin && (
        <AddAdminPopup
          header="Edit Admin"
          onConfirm={handleUpdateAdmin}
          onClose={handleCloseEditPopup}
          closePopup={handleCloseEditPopup}
          formData={{
            firstName: selectedAdmin.firstName,
            email: selectedAdmin.email,
            username: selectedAdmin.username,
            password: "",
            userRole: (selectedAdmin.roles[0]?.roleName === "SUPER_ADMIN" 
              ? "SUPER_ADMIN" 
              : "ADMIN") as "SUPER_ADMIN" | "ADMIN"
          }}
          passwordOn={false}
        />
      )}

      {openTogglePopup && (
        <AdminTogglePopup onConfirm={confirmToggleStatus} onClose={handleCloseTogglePopup} />
      )}
    </div>
  );
};

export default ManageAccountsPage;