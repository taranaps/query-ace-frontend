'use client';

import React, { useState } from 'react';
import styles from './designbutton.module.css';

interface DesignButtonProps {
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

const DesignButton: React.FC<DesignButtonProps> = ({ label, isActive = false, onClick }) => {
    return (
        <button
            className={`${styles.designButton} ${isActive ? styles.active : ''}`}
            onClick={onClick}
        >
            <span className={styles.filterLabel}>Filter by :</span>
            <span className={styles.label}>{label}</span>
            <span className={styles.icon}>▼</span>
        </button>
    );
};
const FilterButtons: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>('Customers');

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    return (
        <div className={styles.container}>
            <DesignButton
                label="Customers"
                isActive={activeFilter === 'Customers'}
                onClick={() => handleFilterClick('Customers')}
            />
            <DesignButton
                label="Created By"
                isActive={activeFilter === 'Created By'}
                onClick={() => handleFilterClick('Created By')}
            />
        </div>
    );
};

export default FilterButtons;
