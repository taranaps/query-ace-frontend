import React from "react";
import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import SlidingToggle from "../sliding-toggle/SlidingToggle";

/**
 * Interface for the props used in the `TableRow` component.
 * 
 * @typedef {Object} TableRowProps
 * @property {string} name - The name of the user displayed in the row.
 * @property {string} email - The email of the user displayed in the row.
 * @property {string} userRole - The user role (e.g., "ADMIN", "USER").
 * @property {"ACTIVE" | "INACTIVE"} status - The current status of the user, either "ACTIVE" or "INACTIVE".
 * @property {boolean} isActive - The current active status of the user.
 * @property {string} [rowClassName] - Optional class name for the table row.
 * @property {function(boolean): void} onToggle - A callback function called when the status toggle is clicked.
 * @property {function(): void} [onRowClick] - Optional callback function called when the row is clicked.
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

/**
 * `TableRow` is a functional component that represents a single row in the table.
 * It displays user details such as name, email, role, and status. If the user role is "ADMIN",
 * it includes a sliding toggle to change the user's status.
 * 
 * @component
 * 
 * @param {TableRowProps} props - The properties passed to the component.
 * @returns {React.Element} The rendered table row component.
 */
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
     /**
     * Handles row click events.
     * Triggers the `onRowClick` callback if provided.
     */
    const handleRowClick = () => {
        if (onRowClick) {
            onRowClick();
        }
    };

    /**
     * Handles toggle click events.
     * Stops the event propagation and toggles the user's status.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered on click.
     */
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
 