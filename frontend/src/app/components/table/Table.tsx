import React from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow as MuiTableRow,
    TableContainer,
    Paper,
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
}

const TableWrapper: React.FC<TableWrapperProps> = ({ data, onToggleStatus }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <MuiTableRow>
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
