"use client";

import React, { useState } from "react";
import CustomButton from "../custom-button/CustomButton";
import styles from "./questioncard.module.css";

import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import cancelAnimation from "../../../../public/assets/animatedIcons/Close.json";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";

interface QuestionCardProps {
  id: number;
  text: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ id, text, onDelete, onEdit }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState(text);

  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableQuestion);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableQuestion(text);
  };

  return (
    <div className={styles.questionCard}>

      {isEditing ? (
        <input
          type="text"
          value={editableQuestion}
          onChange={(e) => setEditableQuestion(e.target.value)}
          className={styles.editableInput}
        />
      ) : (
        <p className={styles.questionText}>{editableQuestion}</p>
      )}


      <div className={styles.cardActions}>
        <div className={styles.dataCardActionButtons}>
          {isEditing ? (
            <>
              <LottieIconButton
                animationData={saveAnimation}
                label="Save"
                onClick={handleSave}
              />
              <LottieIconButton
                animationData={cancelAnimation}
                label="Cancel"
                onClick={handleCancelEdit}
              />
            </>
          ) : (
            <LottieIconButton
              animationData={editAnimation}
              label="Edit"
              onClick={handleEdit}
            />
          )}
          <LottieIconButton
            animationData={deleteAnimation}
            label="Delete"
            onClick={() => onDelete(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
