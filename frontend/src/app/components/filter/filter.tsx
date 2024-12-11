import React, { useState } from "react";
import './filter.css';

interface FilterProps {
  admins: string[];
  onFilterChange: (selectedAdmins: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ admins, onFilterChange }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSelect = (admin: string) => {
    const updatedSelection = selectedAdmins.includes(admin)
      ? selectedAdmins.filter((a) => a !== admin) // Remove if selected
      : [...selectedAdmins, admin]; // Add if not selected

    setSelectedAdmins(updatedSelection);
    onFilterChange(updatedSelection);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="filter-container">
      <button className="filter-button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        Filter by: Admin
      </button>
      {isPopupOpen && (
        <div className="filter-popup">
          <div className="popup-header">
            <h4>Filter Admins</h4>
            <button className="close-button" onClick={() => setIsPopupOpen(false)}>
              ✕
            </button>
          </div>
          <div className="filter-search">
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="filter-list">
            {filteredAdmins.map((admin, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`admin-${index}`}
                  checked={selectedAdmins.includes(admin)}
                  onChange={() => handleSelect(admin)}
                />
                <label htmlFor={`admin-${index}`}>{admin}</label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Filter;
