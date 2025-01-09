"use client";

import React, { useState, useRef } from "react";

interface FilterDropdownProps {
  label: string;
  tagGroups?: {
    tagGroupName: string;
    tagNames: string[];
  }[];
  options?: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options = [],
  tagGroups = [],
  selectedOptions,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterTags = (tags: string[]) =>
    tags.filter((tag) =>
      tag.toLowerCase().includes(search.toLowerCase())
    );

  const handleCheckboxChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        className={`border rounded p-2 w-48 text-left ${isOpen ? "bg-orange-100" : "bg-white"
          } hover:bg-orange-100 transition duration-200`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
        <span className="float-right">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border rounded shadow-lg">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b focus:outline-none"
          />

          <div className="max-h-40 overflow-y-auto p-2">
            {tagGroups.length > 0 &&
              tagGroups.map((group, index) => {
                const filteredTags = filterTags(group.tagNames);
                if (filteredTags.length === 0) return null;

                return (
                  <div key={index} className="mb-4">
                    <strong className="block mb-2">{group.tagGroupName}</strong>
                    {filteredTags.map((tag, tagIndex) => (
                      <div key={tagIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(tag)}
                          onChange={() => handleCheckboxChange(tag)}
                          className="w-4 h-4"
                        />
                        <label className="text-sm">{tag}</label>
                      </div>
                    ))}
                  </div>
                );
              })}

            {options.length > 0 &&
              filterTags(options).map((option) => (
                <div key={option} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">{option}</label>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
