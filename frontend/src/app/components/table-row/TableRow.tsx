import React from "react";
import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import SlidingToggle from "../sliding-toggle/SlidingToggle";

interface TableRowProps {
    name: string;
    email: string;
    location: string;
    status: "Active" | "Inactive";
    isActive: boolean;
    onToggle: (newStatus: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({ name, email, location, status, isActive, onToggle }) => {
    return (
        <MuiTableRow>
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
                <Typography
                    variant="body2"
                    sx={{
                        color: status === "Active" ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {status}
                </Typography>
            </TableCell>
            <TableCell>
                <SlidingToggle checked={isActive} onChange={onToggle} />
            </TableCell>
        </MuiTableRow>
    );
};

export default TableRow;
