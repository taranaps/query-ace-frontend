/**
 * @module Filter
 * @description
 * A dropdown component that lets users filter system logs by admin username.
 * Features include:
 * - Searchable dropdown of admin names
 * - Clear selection option
 * - Real-time search filtering
 * - Handles empty states
 * - Maintains selected state
 * - Popup interface for better mobile experience
 */
import React, { useState } from "react";
import './filter.css';
import { UserDTO } from "types/system-log";

/**
 * @interface FilterProps
 * @description
 * Props required by the Filter component.
 * 
 * @property {UserDTO[]} userNames - List of all admin users that can be filtered
 * @property {Function} onFilterChange - Callback when filter selection changes
 */
interface FilterProps {
  userNames: UserDTO[];
  onFilterChange: (selectedUser: string | null) => void;
}

/**
 * @component Filter
 * @description
 * A filter component that shows a popup with searchable list of admin names.
 * Users can:
 * - Open/close the filter popup
 * - Search through admin names
 * - Select/deselect admins
 * - See currently selected admin
 * 
 * State Management:
 * - Tracks popup open/close state
 * - Manages search input
 * - Maintains selected user
 * 
 * Search Features:
 * - Case-insensitive search
 * - Real-time filtering
 * - Handles empty search results
 * 
 * @param {FilterProps} props - Component properties
 * @returns {JSX.Element} Rendered filter component
 */
const Filter: React.FC<FilterProps> = ({ userNames, onFilterChange }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  /**
   * @function handleSearchChange
   * @description
   * Manages the search input field in the filter popup.
   * Updates search query state for filtering admin names.
   * Converts input to lowercase for case-insensitive search.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  /**
   * @function handleSelect
   * @description
   * Handles selection/deselection of admin names in the filter.
   * Key features:
   * - Toggles selection (clicking selected admin deselects them)
   * - Updates parent component via callback
   * - Closes popup after selection
   * - Logs selection changes for debugging
   * 
   * State Updates:
   * - Updates selected user state
   * - Triggers filter change callback
   * - Controls popup visibility
   * 
   * @param {string} username - Selected admin's username
   */
  const handleSelect = (username: string) => {
    console.log('Before selection - Current selected user:', selectedUser);
    console.log('Clicking on username:', username);
    
    const newSelection = selectedUser === username ? null : username;
    console.log('New selection will be:', newSelection);
    
    setSelectedUser(newSelection);
    onFilterChange(newSelection);
    setIsPopupOpen(false);
  };

  /**
   * @constant {UserDTO[]} filteredUsers
   * @description
   * Filters the list of admin names based on search query.
   * Features:
   * - Case-insensitive filtering
   * - Handles null/undefined usernames safely
   * - Returns empty array if userNames is not provided
   * 
   * @returns {UserDTO[]} Filtered list of admin users
   */
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