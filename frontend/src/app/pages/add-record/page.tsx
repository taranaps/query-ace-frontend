"use client";

/**
 * @module AddRecordPage
 *
 * .
 * Represents the page for adding records in the application. This module handles user authentication
 * checks and conditionally renders the page or redirects unauthorized users.
 */
import React, { useEffect } from "react";
import NavigationTabs from "@/app/components/navigation-tabs/NavigationTabs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {string} status - The user's status, which can be 'ACTIVE' or 'INACTIVE'.
 */

/**
 * A functional React component that renders the AddRecordPage.
 *
 * @function AddRecordPage
 * @memberof module:AddRecordPage
 *
 * @returns {JSX.Element} The rendered AddRecordPage component, or a redirection to the login page.
 *
 * @example
 * // Usage example in a Next.js application
 * import AddRecordPage from "@/app/pages/AddRecordPage";
 *
 * export default function App() {
 *   return <AddRecordPage />;
 * }
 *
 * @throws Will redirect the user to `/pages/login` if the user is not authenticated or their status is 'INACTIVE'.
 * @todo Add more features like role-based access control and dynamic tabs for NavigationTabs.
 * @see {@link NavigationTabs} for rendering navigation tabs in the page.
 */
const AddRecordPage = () => {
  const { user } = useAuth(); // Retrieves user authentication details from AuthContext.
  const router = useRouter(); // Provides navigation capabilities for programmatic routing.

  /**
   * Monitors the user's authentication state and redirects to the login page if necessary.
   *
   * @function useEffect
   * @memberof module:AddRecordPage
   *
   * @throws {Error} If the `router.push` fails due to incorrect routing.
   */
  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationTabs />
    </div>
  );
};

export default AddRecordPage;
