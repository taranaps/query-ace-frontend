import React from "react";
import { ButtonGroup, Button, SxProps } from "@mui/material";

interface SortFilterButtonProps {
    sx?: SxProps;
    sortOrder: "newest" | "earliest";
    onSortChange: (order: "newest" | "earliest") => void;
}

const SortFilterButton: React.FC<SortFilterButtonProps> = ({ sx, sortOrder, onSortChange }) => {
    return (
        <ButtonGroup variant="outlined" sx={{
            borderRadius: "8px",
            ...sx,
        }}>
            <Button
                onClick={() => onSortChange("newest")}
                sx={{
                    backgroundColor: sortOrder === "newest" ? "#FFEBD8" : "#F9FBFF",
                    color: sortOrder === "newest" ? "#FF9500" : "#B5B7C0",
                    textTransform: "none",
                    border: "1px solid #E7E7E7",
                    "&:hover": {
                        backgroundColor: "#FFEBD8",
                        color: "#FF9500",
                    },
                }}
            >
                Newest
            </Button>
            <Button
                onClick={() => onSortChange("earliest")}
                sx={{
                    backgroundColor: sortOrder === "earliest" ? "#FFEBD8" : "#F9FBFF",
                    color: sortOrder === "earliest" ? "#FF9500" : "#B5B7C0",
                    textTransform: "none",
                    border: "1px solid #E7E7E7",
                    "&:hover": {
                        backgroundColor: "#FFEBD8",
                        color: "#FF9500",
                    },
                }}
            >
                Earliest
            </Button>
        </ButtonGroup>
    );
};

export default SortFilterButton;
