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
              isActive={row.isActive}
              rowClassName={rowClassName}
              onToggle={(newStatus) => {
                console.log(`Email: ${row.email}, Toggle to: ${newStatus}`);
                onToggleStatus(row.email, newStatus);
              }}
              onRowClick={() => { onEditAdmin(row.id); }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableWrapper;
