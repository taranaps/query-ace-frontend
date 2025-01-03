import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DataCardDashboard from "./DataCardDashboard";
import "@testing-library/jest-dom";

jest.mock("../lottie-animated-button/LottieIconButton", () => {
  return ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  );
});

const mockProps = {
  id: 1,
  question: "What is React?",
  answer: "React is a JavaScript library for building user interfaces.",
  customer: "Tech Corp",
  createdBy: "Jane Doe",
  createdAt: "2025-01-01",
  tags: [
    { tagName: "UI", tagGroupName: "Frontend" },
    { tagName: "Library", tagGroupName: "Framework" },
  ],
  editOn: true,
  deleteOn: true,
  copyOn: true,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onClick: jest.fn(),
};

describe("DataCardDashboard Component", () => {
  it("renders the question, answer, and tags correctly", () => {
    render(<DataCardDashboard {...mockProps} />);
    expect(screen.getByText("Question : What is React?")).toBeInTheDocument();
    expect(
      screen.getByText("React is a JavaScript library for building user interfaces.")
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
  });

  it("calls the onClick prop when the card is clicked", () => {
    render(<DataCardDashboard {...mockProps} />);
    fireEvent.click(screen.getByText("Question : What is React?"));
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it("handles edit functionality", () => {
    render(<DataCardDashboard {...mockProps} />);
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("What is React?"), {
      target: { value: "What is React.js?" },
    });
    fireEvent.click(screen.getByText("Save"));
    expect(mockProps.onEdit).toHaveBeenCalledWith(
      mockProps.id,
      "What is React.js?",
      "React is a JavaScript library for building user interfaces."
    );
  });

  it("handles delete functionality", () => {
    render(<DataCardDashboard {...mockProps} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id);
  });
});
