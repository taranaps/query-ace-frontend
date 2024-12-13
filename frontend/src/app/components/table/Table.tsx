import React from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow as MuiTableRow,
    TableContainer,
} from "@mui/material";
import TableRow from "../table-row/TableRow";

interface TableWrapperProps {
    data: {
        name: string;
        email: string;
        location: string;
        status: "Active" | "Inactive";
        isActive: boolean;
        timestamp: Date;
    }[];
    onToggleStatus: (email: string, newStatus: boolean) => void;
    sx?: object;
    headerClassName?: string; // Add headerClassName
    rowClassName?: string;    // Add rowClassName
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    data,
    onToggleStatus,
    sx,
    headerClassName,
    rowClassName,
}) => {
    return (
        <TableContainer
            sx={{
                ...sx,
                border: "none",         // Removes border around table
                boxShadow: "none",      // Removes box shadow
                "& .MuiTableCell-root": {
                    // border: "none",    // Removes cell borders
                    padding: "8px",     // Adjust padding if needed
                },
            }}
        >
            <Table>
                <TableHead>
                    <MuiTableRow className={headerClassName}>
                        <TableCell>Admin Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </MuiTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={`${row.name}-${row.timestamp}`} // Ensure unique key for each row
                            name={row.name}
                            email={row.email}
                            location={row.location}
                            status={row.status}
                            isActive={row.isActive}
                            rowClassName={rowClassName}
                            onToggle={(newStatus) => {
                                console.log(`Email: ${row.email}, Toggle to: ${newStatus}`); // Debug
                                onToggleStatus(row.email, newStatus); // Pass email instead of index
                            }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableWrapper;
