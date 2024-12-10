"use client";

import React from "react";
import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SortFilterButton: React.FC<{ sx?: object }> = ({ sx }) => {
    return (
        <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            sx={{ ...sx, maxWidth: "300px", textTransform: "none", borderRadius: 4 }}
        >
            Sort by: Newest
        </Button>
    );
};

export default SortFilterButton;
