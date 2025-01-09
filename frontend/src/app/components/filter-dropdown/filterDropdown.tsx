import React, { useState } from "react";
import styles from "./filterDropdown.module.css";

interface FilterDropdownProps {
    label: string;
    tagGroups?: {
        groupName: string;
        tags: string[];
    }[];
    options?: string[];
    selectedOptions: string[];
    onChange: (selectedOptions: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    tagGroups,
    options,
    selectedOptions,
    onChange,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionChange = (option: string) => {
        const updatedSelection = selectedOptions.includes(option)
            ? selectedOptions.filter((selected) => selected !== option)
            : [...selectedOptions, option];

        onChange(updatedSelection);
    };

    return (
        <div className={styles.filterDropdown}>
            <button
                className={styles.dropdownButton}
                onClick={handleToggleDropdown}
            >
                {label}
            </button>
            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    {tagGroups
                        ?
                        tagGroups.map((group, index) => (
                            <div key={index} className={styles.group}>
                                <strong>{group.groupName}</strong>
                                {group.tags.map((tag, tagIndex) => (
                                    <div key={tagIndex} className={styles.dropdownItem}>
                                        <input
                                            type="checkbox"
                                            id={`tag-${tagIndex}`}
                                            checked={selectedOptions.includes(tag)}
                                            onChange={() => handleOptionChange(tag)}
                                        />
                                        <label htmlFor={`tag-${tagIndex}`}>{tag}</label>
                                    </div>
                                ))}
                            </div>
                        ))
                        :
                        options?.map((option, index) => (
                            <div key={index} className={styles.dropdownItem}>
                                <input
                                    type="checkbox"
                                    id={`option-${index}`}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                />
                                <label htmlFor={`option-${index}`}>{option}</label>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
