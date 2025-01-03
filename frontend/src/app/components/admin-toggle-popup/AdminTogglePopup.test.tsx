import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminTogglePopup from "./AdminTogglePopup";
import "@testing-library/jest-dom";



describe("AdminTogglePopup Component", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the popup with title and content", () => {
        render(
            <AdminTogglePopup
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByText("Are you sure ?")).toBeInTheDocument();
        expect(
            screen.getByText("Are you sure you want to change this account status ?")
        ).toBeInTheDocument();
    });

    test("renders Cancel and Confirm buttons", () => {
        render(
            <AdminTogglePopup
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    test("calls onClose when Cancel button is clicked", () => {
        render(
            <AdminTogglePopup
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        fireEvent.click(screen.getByText("Cancel"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("calls onConfirm when Confirm button is clicked", () => {
        render(
            <AdminTogglePopup
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        fireEvent.click(screen.getByText("Confirm"));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
});
