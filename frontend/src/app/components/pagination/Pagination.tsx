"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface PaginationProps {
    sx?: object;
}

const Pagination: React.FC<PaginationProps> = ({ sx }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2, ...sx }}>
            <Button variant="outlined" size="small" disabled>
                {"<"}
            </Button>
            <Typography> 1 </Typography>
            <Button variant="outlined" size="small" disabled>
                {">"}
            </Button>
        </Box>
    );
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
        p: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 1,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Previous Button */}
      <Button
        variant="contained"
        size="small"
        color="primary"
        disabled={isPrevDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        sx={{
          backgroundColor: isPrevDisabled ? "#d3d3d3" : "primary.main",
          "&:hover": { backgroundColor: isPrevDisabled ? "#d3d3d3" : "primary.dark" },
        }}
      >
        {"< Previous"}
      </Button>

      {/* Current Page Display */}
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      >
        Page {currentPage} of {totalPages}
      </Typography>

      {/* Next Button */}
      <Button
        variant="contained"
        size="small"
        color="primary"
        disabled={isNextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        sx={{
          backgroundColor: isNextDisabled ? "#d3d3d3" : "primary.main",
          "&:hover": { backgroundColor: isNextDisabled ? "#d3d3d3" : "primary.dark" },
        }}
      >
        {"Next >"}
      </Button>
    </Box>
  );
};
}
export default Pagination;



