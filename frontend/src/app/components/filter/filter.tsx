// import React, { useState } from "react";
// import "./filter.css";

// interface TagData {
//   tagGroupName: string;
//   tagNames: string[];
// }

// interface FilterProps {
//   label: string;
//   tagData: TagData[];
//   onFilterChange: (selectedTags: string[]) => void;
// }

// const Filter: React.FC<FilterProps> = ({ tagData, onFilterChange }) => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value.toLowerCase());
//   };

//   const handleSelect = (tag: string) => {
//     const updatedSelection = selectedTags.includes(tag)
//       ? selectedTags.filter((t) => t !== tag)
//       : [...selectedTags, tag];

//     setSelectedTags(updatedSelection);
//     onFilterChange(updatedSelection);
//   };

//   const handleHover = (groupName: string) => {
//     setHoveredGroup(groupName);
//   };

//   const handleMouseLeave = () => {
//     setHoveredGroup(null);
//   };

//   return (
//     <div className="filter-container">
//       <button className="filter-button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
//         Filter by: Tags
//       </button>
//       {isPopupOpen && (
//         <div className="filter-popup">
//           <div className="popup-header">
//             <h4>Filter Tags</h4>
//             <button className="close-button" onClick={() => setIsPopupOpen(false)}>
//               ✕
//             </button>
//           </div>

//           <div className="filter-group-dropdown">
//             {tagData.map((group, index) => (
//               <div
//                 key={index}
//                 className="filter-group"
//                 onMouseEnter={() => handleHover(group.tagGroupName)}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <button className="dropdown-toggle">{group.tagGroupName}</button>

//                 {hoveredGroup === group.tagGroupName && (
//                   <ul className="tag-list">
//                     {group.tagNames.map((tag, idx) => (
//                       <li key={idx}>
//                         <input
//                           type="checkbox"
//                           id={`tag-${idx}`}
//                           checked={selectedTags.includes(tag)}
//                           onChange={() => handleSelect(tag)}
//                         />
//                         <label htmlFor={`tag-${idx}`}>{tag.trim()}</label>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Filter;
