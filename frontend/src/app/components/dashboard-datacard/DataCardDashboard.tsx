"use client";

import React, { useState } from "react";
import Button from "../button/Button";
import styles from "./datacard.module.css";

interface DataCardProps {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string, newDescription: string) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(text);
  const [editableDescription, setEditableDescription] = useState(description);

  // Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  // Handle Save Changes
  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableText, editableDescription); // Save new values
  };

  return (
    <div className={styles.dataCard}>
      {/* Editable Text and Description */}
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className={styles.editableInput}
          />
          <textarea
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
            className={styles.editableTextarea}
          />
        </div>
      ) : (
        <div>
          <p className={styles.dataCardText}>{editableText}</p>
          <p className={styles.dataCardDescription}>{editableDescription}</p>
        </div>
      )}

      {/* Footer */}
      <div className={styles.dataCardFooter}>
        <div className={styles.dataCardDetails}>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className={styles.dataCardActions}>
          {/* Delete Button */}
          <Button
            backgroundColor="#D64545"
            label=""
            onClick={() => onDelete(id)}
            rightIconPath="/assets/icons/delete-white-small.png"
          />
          {/* Edit/Save Button */}
          {isEditing ? (
            <Button
              backgroundColor="#6C9A8B"
              label="Save"
              onClick={handleSave}
              rightIconPath="/assets/icons/save-white-small.png"
            />
          ) : (
            <Button
              backgroundColor="#6C9A8B"
              label=""
              onClick={() => setIsEditing(true)}
              rightIconPath="/assets/icons/edit-white-small.png"
            />
          )}
          {/* Copy Button */}
          <Button
            backgroundColor={copied ? "#4CAF50" : "#567899"} // Change color when copied
            label={copied ? "Copied!" : ""}
            onClick={handleCopy}
            rightIconPath={copied ? "" : "/assets/icons/copy-white-small.png"} // Hide icon when copied
          />
        </div>
      </div>
    </div>
  );
};

export default DataCardDashboard;
