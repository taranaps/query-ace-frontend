import React, { useState, ChangeEvent } from "react";
import styles from "../text-field/TextField.module.css";

interface TextFieldProps {
  id?: string;  // Add ID prop
  placeholder: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

const Textfield: React.FC<TextFieldProps> = ({
  id,
  placeholder,
  value,
  type = "text",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  
  return (
    <input
      id={id || `${placeholder.toLowerCase()}-input`}  // Generate unique IDs
      className={styles.inputField}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Textfield;
