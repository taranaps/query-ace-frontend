import React from "react";
import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import SlidingToggle from "../sliding-toggle/SlidingToggle";

interface TableRowProps {
    name: string;
    email: string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
    isActive: boolean;
    rowClassName?: string;
    onToggle: (newStatus: boolean) => void;
    onRowClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
    name,
    email,
    location,
    status,
    isActive,
    rowClassName,
    onToggle,
    onRowClick,
}) => {
    const handleRowClick = () => {
        if (onRowClick) {
            onRowClick();
        }
    };

    const handleToggleClick = (event: React.MouseEvent) => {
        event.stopPropagation(); 
        onToggle(!isActive);
    };

    return (
        <MuiTableRow
            className={rowClassName}
            onClick={handleRowClick}
            sx={{
                marginBottom: "8px",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "#f5f5f5",
                },
            }}
        >
            <TableCell>
                <Typography variant="body2">{name}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{email}</Typography>
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center justify-center w-[80px] h-[30px] text-sm font-semibold rounded-lg 
                        ${status === "ACTIVE"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                >
                    {status}
                </span>
            </TableCell>
            <TableCell>
                <div onClick={handleToggleClick}>
                    <SlidingToggle checked={status === "ACTIVE"} onChange={onToggle} />
                </div>
            </TableCell>
        </MuiTableRow>
    );
};

export default TableRow;
