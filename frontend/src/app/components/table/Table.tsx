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
    headerClassName?: string; 
    rowClassName?: string;   
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
                border: "none",         
                boxShadow: "none",      
                "& .MuiTableCell-root": {
                    
                    padding: "8px",     
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
                            key={`${row.name}-${row.timestamp}`} 
                            name={row.name}
                            email={row.email}
                            location={row.location}
                            status={row.status}
                            isActive={row.isActive}
                            rowClassName={rowClassName}
                            onToggle={(newStatus) => {
                                console.log(`Email: ${row.email}, Toggle to: ${newStatus}`); 
                                onToggleStatus(row.email, newStatus); 
                            }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableWrapper;