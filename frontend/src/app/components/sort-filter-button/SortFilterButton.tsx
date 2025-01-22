import React from "react";
import { ButtonGroup, Button, SxProps } from "@mui/material";

interface SortFilterButtonProps {
    sx?: SxProps;
    sortOrder: "newest" | "earliest";
    onSortChange: (order: "newest" | "earliest") => void;
}

/**
 * A functional component that renders a group of buttons for sorting based on "newest" or "earliest".
 * 
 * @component
 * @example
 * return (
 *   <SortFilterButton
 *     sortOrder="newest"
 *     onSortChange={(order) => console.log(order)} 
 *     sx={{ margin: "20px" }}
 *   />
 * );
 * 
 * @param {Object} props - The component's props.
 * @param {SxProps} [props.sx] - The styles to apply to the button group (optional).
 * @param {("newest" | "earliest")} props.sortOrder - The current sorting order, either "newest" or "earliest".
 * @param {function} props.onSortChange - A callback function that gets called when the sorting order is changed.
 * 
 * @returns {React.Element} The rendered button group component for sorting.
 */
const SortFilterButton: React.FC<SortFilterButtonProps> = ({ sx, sortOrder, onSortChange }) => {
    return (
        <ButtonGroup sx={{
            borderRadius: "10px",
            overflow: "hidden",
            ...sx,
        }}>
            <Button
                onClick={() => onSortChange("newest")}
                sx={{
                    backgroundColor: sortOrder === "newest" ? "#FFEBD8" : "#F9FBFF",
                    color: sortOrder === "newest" ? "#FF9500" : "#B5B7C0",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
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
                    fontSize: "14px",
                    fontWeight: 500,
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
