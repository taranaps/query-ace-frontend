"use client";

import React, { useState } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton"; // Import the LottieIconButton component
import styles from "./datacard.module.css";

import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import cancelAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";

interface DataCardProps {
  id: number;
  question: string;
  answer: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  tags: { tagName: string; tagGroupName: string }[];
  editOn: boolean;
  deleteOn: boolean;
  copyOn: boolean;
  onEdit: (id: number, newQuestion: string, newAnswer: string) => void;
  onDelete: (id: number) => void;
  onClick?: () => Promise<void>;
}

const MAX_QUESTION_WORDS = 20;
const MAX_ANSWER_WORDS = 40;

const truncateText = (text: string | undefined, limit: number): string => {
  if (!text) return ""; // Return an empty string if text is undefined or null
  const words = text.split(" ");
  return words.length > limit ? `${words.slice(0, limit).join(" ")}...` : text;
};

const DataCardDashboard: React.FC<DataCardProps> = ({
  id,
  question,
  answer,
  customer,
  createdBy,
  createdAt,
  tags,
  editOn,
  deleteOn,
  copyOn,
  onEdit,
  onDelete,
  onClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState(question);
  const [editableAnswer, setEditableAnswer] = useState(answer);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(id, editableQuestion, editableAnswer);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableQuestion(question);
    setEditableAnswer(answer);
  };

  return (
    <div
      className={styles.dataCard}
      onClick={onClick ? onClick : undefined}
    >
      <div className={styles.dataCardTop}>
        {isEditing ? (
          <div className={styles.dataCardQuestionAndAnswerContainer}>
            <input
              type="text"
              value={editableQuestion}
              onChange={(e) => setEditableQuestion(e.target.value)}
              className={styles.dataCardQuestion}
            />
            <input
              type="text"
              value={editableAnswer}
              onChange={(e) => setEditableAnswer(e.target.value)}
              className={styles.dataCardAnswer}
            />
          </div>
        ) : (
          <div className={styles.dataCardQuestionAndAnswerContainer}>
            <p className={styles.dataCardQuestion}>
              Question : {truncateText(question, MAX_QUESTION_WORDS)}
            </p>
            <div className={styles.dataCardAnswerContainer}>
              <p className={styles.dataCardAnswer}>
                {truncateText(answer, MAX_ANSWER_WORDS)}
              </p>
              {!isEditing && copyOn && (
                <div className={styles.copyButton}>
                  <LottieIconButton
                    animationData={copyAnimation}
                    label="Copy Answer"
                    onClick={() => handleCopy(answer)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.dataCardTags}>
        {tags.map((tag, index) => (
          <div
            key={index}
            className={styles.tag}
          >
            <div className={styles.tagGroup}>
              {tag.tagGroupName}
            </div>
            <div className={styles.tagName}>
              {tag.tagName}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dataCardFooter}>
        <div className={styles.dataCardDetails}>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className={styles.dataCardActionButtons}>
          <div className={styles.dataCardActions}>
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

export default DataCardDashboard;
