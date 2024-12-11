import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        // Always show the first page
        if (currentPage > 2) {
            pageNumbers.push(1);
        }

        // Show ellipsis if current page is more than 3
        if (currentPage > 3) {
            pageNumbers.push('...');
        }

        // Show current page and surrounding pages
        if (currentPage > 1) pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        if (currentPage < totalPages) pageNumbers.push(currentPage + 1);

        // Show ellipsis if current page is less than total pages - 2
        if (currentPage < totalPages - 2) {
            pageNumbers.push('...');
        }

        // Always show the last page
        if (currentPage < totalPages - 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Previous Button */}
            <div
                className={`${currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F5F5F5] border border-[#EEEEEE] hover:bg-blue-600"
                    } px-4 py-2 rounded-lg text-sm`}
            >
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="text-sm text-gray-700"
                >
                    {"<"}
                </button>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
                {renderPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={index} className="text-gray-600">...</span>
                    ) : (
                        <div
                            key={index}
                            className={`${page === currentPage
                                ? "bg-[#FF9500] border-[#FF9500]"
                                : "bg-[#F5F5F5] border-[#EEEEEE]"
                                } border px-3 py-2 rounded-md`}
                        >
                            <button
                                onClick={() => goToPage(page as number)}
                                className={`text-sm ${page === currentPage ? "text-white" : "text-gray-700"}`}
                                disabled={page === currentPage}
                            >
                                {page}
                            </button>
                        </div>
                    )
                ))}
            </div>

            {/* Next Button */}
            <div
                className={`${currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F5F5F5] border border-[#EEEEEE] hover:bg-blue-600"
                    } px-4 py-2 rounded-lg text-sm`}
            >
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="text-sm text-gray-700"
                >
                    {">"}
                </button>
            </div>
        </div>
    );
};
export default Pagination;



