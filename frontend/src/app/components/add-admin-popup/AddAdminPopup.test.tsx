import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddAdminPopup from "./AddAdminPopup";
import '@testing-library/jest-dom';


describe("AddAdminPopup Component", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the popup with all fields", () => {
        render(<AddAdminPopup onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    
        const roleDropdown = screen.queryByText((content) => content.includes("SUPER_ADMIN") || content.includes("ADMIN"));
        expect(roleDropdown).toBeInTheDocument();
    
        expect(screen.getByText("Add Admin")).toBeInTheDocument();
    });
    
    it("calls onClose when the Cancel button is clicked", () => {
        render(<AddAdminPopup onClose={mockOnClose} onConfirm={mockOnConfirm} />);

        fireEvent.click(screen.getByText("Cancel"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("validates input fields and calls onConfirm with correct data", () => {
        render(<AddAdminPopup onClose={mockOnClose} onConfirm={mockOnConfirm} />);

        fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
        fireEvent.mouseDown(screen.getByText("Select location"));
        fireEvent.click(screen.getByText("KOCHI"));
        fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "john123" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "securePassword" } });
        fireEvent.mouseDown(screen.getByText("ADMIN"));
        fireEvent.click(screen.getByText("SUPER_ADMIN"));

        fireEvent.click(screen.getByText("Create"));

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).toHaveBeenCalledWith({
            firstName: "John Doe",
            email: "john@example.com",
            location: "KOCHI",
            username: "john123",
            password: "securePassword",
            userRole: "SUPER_ADMIN",
        });
    });

    it("shows an alert if any field is missing", () => {
        window.alert = jest.fn();

        render(<AddAdminPopup onClose={mockOnClose} onConfirm={mockOnConfirm} />);

        fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
        fireEvent.mouseDown(screen.getByText("Select location"));
        fireEvent.click(screen.getByText("KOCHI"));

        fireEvent.click(screen.getByText("Create"));

        expect(window.alert).toHaveBeenCalledWith("Please fill all fields before creating an account.");
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("defaults userRole to ADMIN", () => {
        render(<AddAdminPopup onClose={mockOnClose} onConfirm={mockOnConfirm} />);

        expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });
});
