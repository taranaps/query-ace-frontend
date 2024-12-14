import React from "react";
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number; 
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
        <div className="flex items-center space-x-2">
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

            <div className="flex items-center space-x-1">
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
