import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomButton from "./CustomButton";
import '@testing-library/jest-dom';



describe("CustomButton Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders the button with label", () => {
    render(
      <CustomButton
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ backgroundColor: "blue" });
  });

  test("calls onClick when button is clicked", () => {
    render(
      <CustomButton
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("renders left icon when leftIconPath is provided", () => {
    render(
      <CustomButton
        leftIconPath="/path/to/left-icon.png"
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const leftIcon = screen.getByAltText("Left Icon");
    expect(leftIcon).toBeInTheDocument();
    expect(leftIcon).toHaveAttribute("src", "/path/to/left-icon.png");
  });

  test("renders right icon when rightIconPath is provided", () => {
    render(
      <CustomButton
        rightIconPath="/path/to/right-icon.png"
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const rightIcon = screen.getByAltText("Right Icon");
    expect(rightIcon).toBeInTheDocument();
    expect(rightIcon).toHaveAttribute("src", "/path/to/right-icon.png");
  });

  test("renders both icons when both leftIconPath and rightIconPath are provided", () => {
    render(
      <CustomButton
        leftIconPath="/path/to/left-icon.png"
        rightIconPath="/path/to/right-icon.png"
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const leftIcon = screen.getByAltText("Left Icon");
    const rightIcon = screen.getByAltText("Right Icon");

    expect(leftIcon).toBeInTheDocument();
    expect(leftIcon).toHaveAttribute("src", "/path/to/left-icon.png");

    expect(rightIcon).toBeInTheDocument();
    expect(rightIcon).toHaveAttribute("src", "/path/to/right-icon.png");
  });

  test("does not render icons if no icon paths are provided", () => {
    render(
      <CustomButton
        backgroundColor="blue"
        onClick={mockOnClick}
        label="Click Me"
      />
    );

    const leftIcon = screen.queryByAltText("Left Icon");
    const rightIcon = screen.queryByAltText("Right Icon");

    expect(leftIcon).not.toBeInTheDocument();
    expect(rightIcon).not.toBeInTheDocument();
  });
});
