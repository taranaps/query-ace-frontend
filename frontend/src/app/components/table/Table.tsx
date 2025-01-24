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
import { fetchUserInterface } from "@/app/interface/user/fetchUserInterface";

interface TableWrapperProps {
    data: fetchUserInterface[];
    onToggleStatus: (email: string, newStatus: boolean) => void;
    onEditAdmin: (id: number) => void;
    sx?: object;
    headerClassName?: string;
    rowClassName?: string;
}

/**
 * A functional component that renders a table displaying user data with options to toggle user status and edit admin details.
 * The component displays a table with columns for admin name, email, status, and actions, with the ability to toggle status and edit admin details.
 * 
 * @component
 * @example
 * return (
 *   <TableWrapper
 *     data={userData}
 *     onToggleStatus={handleToggleStatus}
 *     onEditAdmin={handleEditAdmin}
 *   />
 * );
 * 
 * @param {Object} props - The component's props.
 * @param {fetchUserInterface[]} props.data - An array of user data to be displayed in the table.
 * @param {function} props.onToggleStatus - A callback function that toggles the status of a user based on their email and the new status value.
 * @param {function} props.onEditAdmin - A callback function that handles editing an admin based on their ID.
 * @param {object} [props.sx] - Optional style overrides for the table container.
 * @param {string} [props.headerClassName] - Optional class name for the header row.
 * @param {string} [props.rowClassName] - Optional class name for each table row.
 * 
 * @returns {React.Element} The rendered table component.
 */
const TableWrapper: React.FC<TableWrapperProps> = ({
  data,
  onToggleStatus,
  onEditAdmin,
  sx,
  headerClassName,
  rowClassName,
}) => {

  console.log(data);

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
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </MuiTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={`${row.id}-${row.createdAt}`}
                            name={row.firstName}
                            email={row.email}
                            userRole={row.roles[0].roleName}
                            status={row.status}
                            username={row.username}
                            isActive={row.isActive}
                            rowClassName={rowClassName}
                            onToggle={(newStatus) => {
                                console.log(`Email: ${row.email}, Toggle to: ${newStatus}`);
                                onToggleStatus(row.email, newStatus);
                            }}
                            onRowClick={() => { onEditAdmin(row.id) }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableWrapper;
