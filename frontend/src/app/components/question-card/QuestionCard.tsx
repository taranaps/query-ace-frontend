"use client";

import React, { useState } from "react";
import CustomButton from "../custom-button/CustomButton";
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

  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableText); 
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
          <CustomButton
            backgroundColor="#6C9A8B"
            label=""
            onClick={handleSave}
            rightIconPath="/assets/icons/save-white-small.png"
          />
        ) : (
          <CustomButton
            backgroundColor="#6C9A8B"
            label=""
            onClick={() => setIsEditing(true)}
            rightIconPath="/assets/icons/edit-white-small.png"
          />
        )}

        {/* Delete Button */}
        <CustomButton
          backgroundColor="#D64545"
          label="Delete"
          onClick={() => onDelete(id)}
          rightIconPath="/assets/icons/delete-white-small.png"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
