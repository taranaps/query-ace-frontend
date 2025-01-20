import React, { useState } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from "./popup.module.css";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import NewButton from "../new-button/NewButton";

const DataPopupImport = ({
  data = { id: "", question: "", answers: [], tags: [] },
  onClose,
  onSave,
}: {
  data: any;
  onClose: () => void;
  onSave: (updatedData: any) => void;
}) => {
  const [editableQuestion, setEditableQuestion] = useState(data.question || "");
  const [answers, setAnswers] = useState(data.answers || []);
  const [tagGroups, setTagGroups] = useState(data.tags || []);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableQuestion(e.target.value);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], answer: value };
    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: Date.now(), answer: "" }]);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_: any, i: number) => i !== index);
    setAnswers(updatedAnswers);
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...tagGroups];
    updatedTags[index] = { ...updatedTags[index], tagName: value };
    setTagGroups(updatedTags);
  };

  const handleAddTag = () => {
    setTagGroups([
      ...tagGroups,
      { tagGroupName: "New Group", tagName: "New Tag" },
    ]);
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tagGroups.filter((_: any, i: number) => i !== index);
    setTagGroups(updatedTags);
  };

  const handleSave = async() => {
    const updatedData = {
      id: data.id,
      question: editableQuestion,
      answers,
      tags: tagGroups,
    };
    await onSave(updatedData);
    onClose();
  };

  return (
    <div className={styles.popupOverlay}>
      <div
        className={styles.popupContent}
        style={{
          top: "50%",
          left: "50%",
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
          <NewButton variant="custom" onClick={handleAddAnswer} width="fit" type="button">
            Add Answer +
          </NewButton>
        </div>

        <div className={styles.answerContainer}>
          <div className={styles.answerList}>
            {answers.length > 0 ? (
              answers.map((answer: any, index: number) => (
                <div key={answer.id || index} className={styles.answerItem}>
                  <input
                    type="text"
                    value={answer.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className={styles.editableInput}
                  />
                  <button
                    className={styles.crossButton}
                    onClick={() => handleRemoveAnswer(index)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p>No answers available.</p>
            )}

          </div>
        </div>

        <h3 className={styles.tagTitle}>Tags:</h3>
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
            <p>No tags available.</p>
          )}
          <button
            className={`${styles.addTagButton} ${styles.tag}`}
            onClick={handleAddTag}
          >
              Add Tag +
          </button>
        </div>

        <div className={styles.saveButtonContainer}>
          <NewButton variant="custom" onClick={handleSave} width="fit" type="button">
              Save Changes
          </NewButton>
        </div>
      </div>
    </div >
  );
};

export default DataPopupImport;
