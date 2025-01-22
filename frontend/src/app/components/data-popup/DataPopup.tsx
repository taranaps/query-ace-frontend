/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from "./popup.module.css";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import DataPopupAnswerItem from "../data-popup-answer-item/dataPopupAnswerItem";
import { handleDeleteQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { handleAddNewQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import AddTagPopup from "../add-tag-popup/AddTagPopup";
import { formatDate } from "@/app/util/formatDate";
import { handleAddNewTagToExistingQuery } from "@/app/util/tags/tagFunctionalities";
import NewButton from "../../components/new-button/NewButton";

const DataPopup = ({
  data,
  onClose,
  user,
  position,
  size
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
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string }[]>([]);

  const [isTransitionComplete, setIsTransitionComplete] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    answers: [] as string[],
    tags: [] as { group: string; tag: string }[],
  });

  const handleChange = (field: string, value: string | string[] | { group: string; tag: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setTimeout(() => {
      setIsTransitionComplete(true);
    }, 50);
    setAnswers(data.answers || []);
    setTagGroups(data.tags || []);
  }, [data]);

  const handleConfirmDelete = async(itemId: number) => {
    const result = await handleDeleteQueryAnswer(itemId);
    if (result) {
      setAnswers((prevAnswers: any[]) => prevAnswers.filter((answer) => answer.id !== itemId));
    }
  };

  const handleAddAnswer = async() => {
    if (!newAnswer.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await handleAddNewQueryAnswer(newAnswer, user.id, data.id);
    setLoading(false);

    if (result.success) {
      setAnswers((prevAnswers: any[]) => [
        ...prevAnswers,
        {
          id: Date.now(),
          answer: newAnswer,
          createdAt: formatDate(new Date().toString()),
          email: user.email,
          firstName: user.firstName,
          roleName: user.roles[0].roleName,
          updatedAt: formatDate(new Date().toString()),
          usersId: user.id,
          usersUsername: user.username,
        },
      ]);
      setNewAnswer("");
      setIsAddModalOpen(false);
    }
  };

  const handleCancelAdd = () => {
    setNewAnswer("");
    setIsAddModalOpen(false);
  };

  const handleAddTags = async(newTag: { group: string; tag: string }) => {
    const tagPayload = { tagGroupName: newTag.group, tagName: newTag.tag };

    console.log(tagGroups);
    console.log(tagPayload);

    const result = await handleAddNewTagToExistingQuery(data.id, tagPayload);

    if (result.success) {
      setTagGroups((prevTagGroups) => {
        const updatedTagGroups = [...prevTagGroups];
        updatedTagGroups.push({ tagGroupName: newTag.group, tagNames: newTag.tag });
        return updatedTagGroups;
      });

      console.log(tagGroups);

      setIsAddTagPopupOpen(false);
    } else {
      console.error("Failed to add tag to the backend.");
    }
  };

  const handleRemoveTag = (index: number) => handleChange("tags", formData.tags.filter((data, i) => i !== index));

  return (
    <div className={styles.popupOverlay}>
      <div
        className={styles.popupContent}
        style={{
          top: isTransitionComplete ? "50%" : position.top,
          left: isTransitionComplete ? "50%" : position.left,
          width: isTransitionComplete ? "80vw" : `${size.width}px`,
          height: isTransitionComplete ? "80vh" : `${size.height}px`,
          transform: isTransitionComplete ? "translate(-50%, -50%)" : "none",
          transition: "all 0.5s ease",
        }}
      >

        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderQuestion}>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>Question:</p>

            <h2>{data.question}</h2>
          </div>
          <LottieIconButton
            animationData={closeAnimation}
            label="Close"
            onClick={onClose}
          />
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
              {answers.map((answer: any) => (
                <DataPopupAnswerItem
                  key={answer.id}
                  answer={answer}
                  onDelete={handleConfirmDelete}
                />
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
                <div className={styles.tagGroup}>
                  {tag.tagGroupName}
                </div>
                <div className={styles.tagName}>
                  {tag.tagName}
                </div>
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

        {isAddModalOpen && (
          <div className={styles.addAnswerModal}>
            <div className={styles.modalContent}>
              {loading ? (<LottieLoader />) : (
                <>
                  <h3>Add a New Answer</h3>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                    rows={4}
                  />
                  {error && <p className={styles.error}>{error}</p>}
                  <div className={styles.modalActions}>
                    <button onClick={handleAddAnswer} disabled={loading}>
                                            Add
                    </button>
                    <button onClick={handleCancelAdd}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <AddTagPopup
          open={isAddTagPopupOpen}
          onClose={() => setIsAddTagPopupOpen(false)}
          onAddTags={handleAddTags}
        />
      </div>
    </div >
  );
};

export default DataPopup;
