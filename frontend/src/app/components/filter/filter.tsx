import React, { useState } from "react";
import './filter.css';
import { UserDTO } from "types/system-log";

interface FilterProps {
  userNames: UserDTO[];
  onFilterChange: (selectedUser: string | null) => void;
}
const Filter: React.FC<FilterProps> = ({ userNames, onFilterChange }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSelect = (username: string) => {
    console.log('Before selection - Current selected user:', selectedUser);
    console.log('Clicking on username:', username);
    
    const newSelection = selectedUser === username ? null : username;
    console.log('New selection will be:', newSelection);
    
    setSelectedUser(newSelection);
    onFilterChange(newSelection);
    setIsPopupOpen(false);
};

  const filteredUsers = userNames?.filter(user => 
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="filter-container">
      <button className="filter-button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        {selectedUser ? `Filter: ${selectedUser}` : 'Filter by Admin'}
      </button>
      {isPopupOpen && (
        <div className="filter-popup">
          <div className="popup-header">
            <h4>Select Admin</h4>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li key={user.id}>
                  <input
                    type="checkbox"
                    id={`admin-${user.id}`}
                    checked={selectedUser === user.username}
                    onChange={() => handleSelect(user.username)}
                  />
                  <label htmlFor={`admin-${user.id}`}>
                    {user.username}
                  </label>
                </li>
              ))
            ) : (
              <li>No users available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Filter;