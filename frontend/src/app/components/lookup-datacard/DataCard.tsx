"use client";

import React from "react";

interface DataCardProps {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string; // Added description property
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onCopy: (text: string) => void;
}

const DataCard: React.FC<DataCardProps> = ({
  id,
  text,
  customer,
  createdBy,
  createdAt,
  description,
  onDelete,
  onEdit,
  onCopy,
}) => {
  return (
    <div className="bg-white p-4 shadow rounded flex flex-col space-y-2">
      <p className="text-lg font-semibold">{text}</p>
      <p className="text-sm text-gray-700">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-red-400 text-white py-1 px-3 rounded hover:bg-red-600"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-400 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={() => onEdit(id)}
          >
            Edit
          </button>
          <button
            className="bg-green-400 text-white py-1 px-3 rounded hover:bg-green-600"
            onClick={() => onCopy(text)}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
