import React, { useState, useEffect } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from "./popup.module.css";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import DataPopupAnswerItem from "../data-popup-answer-item/dataPopupAnswerItem";
import { handleDeleteQueryAnswer, handleAddNewQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import AddTagPopup from "../add-tag-popup/AddTagPopup";
import { formatDate } from "@/app/util/formatDate";
import { handleAddNewTagToExistingQuery } from "@/app/util/tags/tagFunctionalities";
import NewButton from "../new-button/NewButton";

const DataPopupImport = ({
  data,
  onClose,
  user,
  position,
  size,
}: {
  data: any;
  onClose: () => void;
  user?: any;
  position: { top: number; left: number };
  size: { width: number; height: number };
}) => {
  const [answers, setAnswers] = useState(data.answers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddTagPopupOpen, setIsAddTagPopupOpen] = useState(false);
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagName: string }[]>([]);
  const [editableQuestion, setEditableQuestion] = useState(data.question);

  const [formData, setFormData] = useState({
    question: data.question,
    answers: data.answers || [],
    tags: data.tags || [],
  });

  useEffect(() => {
    setAnswers(data.answers || []);
    setTagGroups(data.tags || []);
  }, [data]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableQuestion(e.target.value);
    setFormData((prev) => ({ ...prev, question: e.target.value }));
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], answer: value };
    setAnswers(updatedAnswers);
    setFormData((prev) => ({ ...prev, answers: updatedAnswers }));
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tagGroups.filter((_, i) => i !== index);
    setTagGroups(updatedTags);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...tagGroups];
    updatedTags[index].tagName = value;
    setTagGroups(updatedTags);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  return (
    <div className={styles.popupOverlay}>
      <div
        className={styles.popupContent}
        style={{
          top: "50%",
          left: "50%",
          width: "80vw",
          height: "80vh",
          transform: "translate(-50%, -50%)",
          transition: "all 0.5s ease",
        }}
      >
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderQuestion}>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>Question:</p>
            <input
              type="text"
              value={editableQuestion}
              onChange={handleQuestionChange}
              className={styles.editableInput}
            />
          </div>
          <LottieIconButton animationData={closeAnimation} label="Close" onClick={onClose} />
        </div>

        <div className={styles.answerTitleandButton}>
          <h3 className={styles.answerTitle}>Answers : ({answers.length})</h3>
          <NewButton
            variant="custom"
            onClick={() => setIsAddModalOpen(true)}
            width="fit"
            type="button"
          >
            Add Answer +
          </NewButton>
        </div>

        <div className={styles.answerContainer}>
          {answers.length > 0 ? (
            <ul className={styles.answerList}>
              {answers.map((answer: any, index: number) => (
                <li key={answer.id} className={styles.editableAnswerItem}>
                  <input
                    type="text"
                    value={answer.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className={styles.editableInput}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No answers available.</p>
          )}
        </div>

        <div className={styles.dataCardTags}>
          {tagGroups.length > 0 ? (
            tagGroups.map((tag: any, index: number) => (
              <div key={index} className={styles.tag}>
                <div className={styles.tagGroup}>{tag.tagGroupName}</div>
                <input
                  type="text"
                  value={tag.tagName}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className={styles.editableInput}
                />
                <button
                  className={styles.crossButton}
                  onClick={() => handleRemoveTag(index)}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className={styles.tag}>No tags available.</p>
          )}
          <button
            className={`${styles.addTagButton} ${styles.tag}`}
            onClick={() => setIsAddTagPopupOpen(true)}
          >
            +
          </button>
        </div>

        <AddTagPopup
          open={isAddTagPopupOpen}
          onClose={() => setIsAddTagPopupOpen(false)}
          onAddTags={(newTag: any) => {
            setTagGroups((prev) => [...prev, newTag]);
          }}
        />
      </div>
    </div>
  );
};

export default DataPopupImport;
