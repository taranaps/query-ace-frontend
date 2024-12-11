import React from "react";
import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import SlidingToggle from "../sliding-toggle/SlidingToggle";

interface TableRowProps {
    name: string;
    email: string;
    location: string;
    status: "Active" | "Inactive";
    isActive: boolean;
    rowClassName?: string;
    onToggle: (newStatus: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({
    name,
    email,
    location,
    status,
    isActive,
    rowClassName,
    onToggle,
}) => {
    return (
        <MuiTableRow className={rowClassName} sx={{ marginBottom: "8px" }}>
            <TableCell>
                <Typography variant="body2">{name}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{email}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{location}</Typography>
            </TableCell>
            <TableCell>
                {/* <Typography
                    variant="body2"
                    sx={{
                        color: status === "Active" ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {status}
                </Typography> */}
                <span
                    className={`inline-flex items-center justify-center w-[80px] h-[30px] text-sm font-semibold rounded-lg ${status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {status}
                </span>
            </TableCell>
            <TableCell>
                <SlidingToggle checked={isActive} onChange={onToggle} />
            </TableCell>
        </MuiTableRow>
    );
};

export default TableRow;
