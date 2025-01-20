"use client";
import React, { useState } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from "./datacard.module.css";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import cancelAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";

interface DataCardProps {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string;
  editOn: boolean;
  deleteOn: boolean;
  copyOn: boolean;
  onEdit: (id: number, newText: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const DataCard: React.FC<DataCardProps> = ({
  id,
  text,
  customer,
  createdBy,
  createdAt,
  description,
  editOn,
  deleteOn,
  copyOn,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(text);
  const [editableDescription, setEditableDescription] = useState(description);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableText, editableDescription);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableText(text);
    setEditableDescription(description);
  };

  return (
    <div className={styles.dataCard}>
      {isEditing ? (
        <div className={styles.dataCardTop}>
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
        <div className={styles.dataCardTop}>
          <p className={styles.dataCardText}>{editableText}</p>
          <p className={styles.dataCardDescription}>{editableDescription}</p>
        </div>
      )}

      <div className={styles.dataCardFooter}>
        <div className={styles.dataCardDetails}>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className={styles.dataCardActions}>
          <div className={styles.dataCardActionButtons}>
            {copyOn && (
              <LottieIconButton
                animationData={copyAnimation}
                label="Copy"
                onClick={handleCopy}
              />
            )}
            {editOn &&
              (isEditing ? (
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
              ))}
            {deleteOn && (
              <LottieIconButton
                animationData={deleteAnimation}
                label="Delete"
                onClick={() => onDelete(id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
