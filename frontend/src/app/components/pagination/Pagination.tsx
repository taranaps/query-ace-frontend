import React from "react";

/**
* Represents the properties for a pagination component.
* @typedef {Object} PaginationProps
* @property {number} currentPage - The current page number being displayed.
* @property {number} totalPages - The total number of pages available.
* @property {function(number): void} onPageChange - Callback function triggered when the page changes. Receives the new page number as an argument.
* @property {number} [itemsPerPage] - Optional. The number of items displayed per page. Defaults to a component-specific value if not provided.
*/
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
}

/**
 * A functional component that renders a pagination control to navigate between pages.
 * It allows the user to navigate between pages, with the ability to go to the previous/next page or directly to a specific page.
 * 
 * @component
 * @example
 * return (
 *   <Pagination
 *     currentPage={1}
 *     totalPages={5}
 *     onPageChange={handlePageChange}
 *   />
 * );
 * 
 * @param {Object} props - The component's props.
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.totalPages - The total number of pages.
 * @param {function} props.onPageChange - A callback function that is called when the page is changed. It receives the new page number as an argument.
 * @param {number} [props.itemsPerPage=10] - The number of items per page (optional, defaults to 10).
 * @returns {React.Element} The rendered pagination component.
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

       /**
     * Handles the previous page navigation.
     * If the current page is greater than 1, it navigates to the previous page.
     */
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

      /**
     * Handles the next page navigation.
     * If the current page is less than the total pages, it navigates to the next page.
     */
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

      /**
     * Navigates to a specific page number.
     * 
     * @param {number} page - The page number to navigate to.
     */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

      /**
     * Renders the page numbers, including ellipses ("...") for skipped page numbers.
     * 
     * @returns {Array} The list of page numbers to display.
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
