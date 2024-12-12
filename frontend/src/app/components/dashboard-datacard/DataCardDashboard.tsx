"use client";

import React from "react";
import Button from "../button/Button";

interface DataCardProps {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onCopy: (text: string) => void;
}

const DataCardDashboard: React.FC<DataCardProps> = ({
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
    <div
      className="bg-white p-4 shadow rounded flex flex-col space-y-2"
      style={{
        width: "100%",
      }}
    >

      <p className="text-lg font-semibold">{text}</p>
      <p className="text-sm text-gray-700">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            backgroundColor="#EF9A9A"
            label="Delete"
            onClick={() => onDelete(id)}
            rightIconPath="/assets/icons/delete-white-small.png"
          />

          <Button
            backgroundColor="#A5D6A7"
            label="Edit"
            onClick={() => onDelete(id)}
            rightIconPath="/assets/icons/edit-white-small.png"
          />
          <Button
            backgroundColor="#90CAF9"
            label="Copy"
            onClick={() => onDelete(id)}
            rightIconPath="/assets/icons/copy-white-small.png"
          />
        </div>
      </div>
    </div>
  );
};

export default DataCardDashboard;
