"use client";

import React, { useState } from "react";
import Button from "../button/Button";
import styles from "./questioncard.module.css";

interface QuestionCardProps {
  id: number;
  text: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ id, text, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text);

  // Handle Save Changes
  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableText); // Save the updated text
  };

  return (
    <div className={styles.questionCard}>
      {/* Editable Text */}
      {isEditing ? (
        <input
          type="text"
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className={styles.editableInput}
        />
      ) : (
        <p className={styles.questionText}>{editableText}</p>
      )}

      {/* Actions (Edit/Save and Delete Buttons) */}
      <div className={styles.cardActions}>
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

        {/* Delete Button */}
        <Button
          backgroundColor="#D64545"
          label=""
          onClick={() => onDelete(id)}
          rightIconPath="/assets/icons/delete-white-small.png"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
