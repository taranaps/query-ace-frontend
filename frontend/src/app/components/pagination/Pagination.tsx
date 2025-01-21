/**
 * @module Pagination
 * @description
 * A pagination component that helps users navigate through multiple pages of content.
 * Shows page numbers, previous/next buttons, and smart ellipsis for many pages.
 * Key features:
 * - Dynamic page number display
 * - Previous/Next navigation
 * - Smart ellipsis for large page ranges
 * - Active page highlighting
 * - Responsive buttons
 * - Boundary checks
 */
import React from "react";

/**
 * @interface PaginationProps
 * @description
 * Properties needed to control the pagination component.
 * Handles both required and optional settings for flexibility.
 * 
 * @property {number} currentPage - Which page is currently being viewed (starts at 1)
 * @property {number} totalPages - Total number of pages available
 * @property {Function} onPageChange - Function to call when a different page is selected
 * @property {number} [itemsPerPage] - Optional setting for items shown per page
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number; 
}

/**
 * @component Pagination
 * @description
 * Shows pagination controls for navigating through pages.
 * Smart features:
 * - Always shows first and last page numbers
 * - Shows pages near current page
 * - Uses ... when there are many pages
 * - Disables buttons at boundaries
 * - Highlights current page
 * - Handles edge cases
 * 
 * Visual elements:
 * - Previous/Next buttons
 * - Page number buttons
 * - Ellipsis indicators
 * - Active page highlight
 * - Hover effects
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    /**
     * @function handlePrev
     * @description
     * Handles clicking the previous button.
     * Makes sure we can't go before page 1.
     * Calls onPageChange with the previous page number.
     */
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    /**
     * @function handleNext
     * @description
     * Handles clicking the next button.
     * Makes sure we can't go past the last page.
     * Calls onPageChange with the next page number.
     */
    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    /**
     * @function goToPage
     * @description
     * Handles clicking a specific page number.
     * Checks that the page number is valid before changing.
     * 
     * @param {number} page - The page number that was clicked
     */
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    /**
     * @function renderPageNumbers
     * @description
     * Figures out which page numbers to show.
     * Smart logic for large number of pages:
     * - Always shows page 1
     * - Shows ... if there's a gap
     * - Shows pages around current page
     * - Always shows last page
     * - Handles special cases for few pages
     * 
     * @returns {Array<number|string>} List of page numbers and ellipses to display
     */
    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (currentPage > 2) {
            pageNumbers.push(1);
        }

        if (currentPage > 3) {
            pageNumbers.push("...");
        }

        if (currentPage > 1) pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        if (currentPage < totalPages) pageNumbers.push(currentPage + 1);

        if (currentPage < totalPages - 2) {
            pageNumbers.push("...");
        }

        if (currentPage < totalPages - 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`${currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F5F5F5] border border-[#EEEEEE] hover:bg-[#FF9500]"
                    } px-2 py-1 rounded-lg text-xs`}
            >
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="text-xs text-gray-700"
                >
                    {"<"}
                </button>
            </div>

            <div className="flex items-center space-x-2">
                {renderPageNumbers().map((page, index) => (
                    page === "..." ? (
                        <span key={index} className="text-gray-600">...</span>
                    ) : (
                        <div
                            key={index}
                            className={`${page === currentPage
                                ? "bg-[#FF9500] border-[#FF9500]"
                                : "bg-[#F5F5F5] border-[#EEEEEE]"
                                } border px-2 py-1 rounded-md h-6 flex items-center justify-center`}
                        >
                            <button
                                onClick={() => goToPage(page as number)}
                                className={`text-xs ${page === currentPage ? "text-white" : "text-gray-700"}`}
                                disabled={page === currentPage}
                            >
                                {page}
                            </button>
                        </div>
                    )
                ))}
            </div>

            <div
                className={`${currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F5F5F5] border border-[#EEEEEE] hover:bg-[#FF9500]"
                    } px-2 py-1 rounded-lg text-xs`}
            >
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="text-xs text-gray-700"
                >
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;