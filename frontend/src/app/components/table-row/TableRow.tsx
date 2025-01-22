import React from "react";
import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import SlidingToggle from "../sliding-toggle/SlidingToggle";

/**
 * A functional component that represents a single row in the table with user details and an optional sliding toggle for status change.
 * The row displays user details such as name, email, role, and status. It also provides functionality to toggle user status for admins.
 * 
 * @component
 * @example
 * return (
 *   <TableRow
 *     name="John Doe"
 *     email="john@example.com"
 *     userRole="ADMIN"
 *     status="ACTIVE"
 *     isActive={true}
 *     onToggle={handleToggleStatus}
 *     onRowClick={handleRowClick}
 *   />
 * );
 * 
 * @param {Object} props - The component's props.
 * @param {string} props.name - The name of the user displayed in the row.
 * @param {string} props.email - The email of the user displayed in the row.
 * @param {string} props.userRole - The user role (e.g., "ADMIN", "USER").
 * @param {"ACTIVE" | "INACTIVE"} props.status - The current status of the user, either "ACTIVE" or "INACTIVE".
 * @param {boolean} props.isActive - The current active status of the user.
 * @param {string} [props.rowClassName] - Optional class name for the table row.
 * @param {function} props.onToggle - A callback function that is called when the status toggle is clicked.
 * @param {function} [props.onRowClick] - Optional callback function that is called when the row is clicked.
 * 
 * @returns {React.Element} The rendered table row component.
 */
interface TableRowProps {
    name: string;
    email: string;
    userRole: string;
    status: "ACTIVE" | "INACTIVE";
    isActive: boolean;
    rowClassName?: string;
    onToggle: (newStatus: boolean) => void;
    onRowClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
    name,
    email,
    userRole,
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
                {userRole === "ADMIN" && (

                    <div onClick={handleToggleClick}>
                        <SlidingToggle
                            checked={status === "ACTIVE" ? true : status === "INACTIVE" ? false : false}
                            onChange={onToggle}
                        />
                    </div>
                )}
            </TableCell>
        </MuiTableRow>
    );
};

export default TableRow;
