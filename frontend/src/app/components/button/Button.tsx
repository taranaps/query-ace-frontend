"use client";

import React from "react";
import styles from "./button.module.css"

interface ButtonProps {
  leftIconPath?: string;
  rightIconPath?: string;
  backgroundColor: string;
  onClick: () => void;
  label: string;
}

const Button: React.FC<ButtonProps> = ({
  leftIconPath,
  rightIconPath,
  backgroundColor,
  onClick,
  label,
}) => {
  return (
    <button
      style={{ backgroundColor }}
      onClick={onClick}
      className={styles.button}
    >
      {leftIconPath && (
        <img src={leftIconPath} alt="Left Icon" className={styles["button-icon"]} />
      )}
      <span>{label}</span>
      {rightIconPath && (
        <img src={rightIconPath} alt="Right Icon" className={styles["button-icon"]} />
      )}
    </button>
  );
};

export default Button;
