// textfield.tsx

import React, { useState, ChangeEvent } from 'react';
import styles from '../text-field/TextField.module.css';

interface TextfieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Textfield: React.FC<TextfieldProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange 
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div>
      {label && <label htmlFor="input">{label}</label>}
      <input 
        type="text" 
        id="input" 
        className={styles.inputField} 
        placeholder={placeholder} 
        value={inputValue} 
        onChange={handleChange} 
      />
    </div>
  );
};

export default Textfield;