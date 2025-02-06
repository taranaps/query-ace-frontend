/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @module DataPopup
 * @description
 * A popup component that shows detailed query information.
 * Features:
 * - Displays full question and answers
 * - Allows adding new answers
 * - Manages tags
 * - Smooth opening animation
 * - Error handling
 * - Loading states
 */

import React, { useState, useEffect } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from "./popup.module.css";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import DataPopupAnswerItem from "../data-popup-answer-item/dataPopupAnswerItem";
import { handleDeleteQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { handleAddNewQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import AddTagPopup from "../add-tag-popup/AddTagPopup";
import { handleAddNewTagToExistingQuery } from "@/app/util/tags/tagFunctionalities";
import NewButton from "../../components/new-button/NewButton";
import { fetchQueryWithAnswers } from "@/app/api/questioncard/fetchQueryAnswers";
/**
 * @component DataPopup
 * @description
 * Displays detailed information about a query including:
 * - Full question text
 * - List of answers with author info
 * - Tag management
 * - Add/delete functionality
 *
 * @param {Object} props - Component properties
 * @param {any} props.data - Query data including answers and tags
 * @param {Function} props.onClose - Function to close the popup
 * @param {any} props.user - Current user information
 * @param {Object} props.position - Initial position for animation
 * @param {Object} props.size - Initial size for animation
 */
interface Answer {
  id: number;
  answer: string;
  createdAt: string;
  updatedAt: string;
  email?: string;
  firstName?: string;
  roleName?: string;
  usersId?: number;
  usersUsername?: string;
}
// interface DataPopupProps {
//   onDataChange?: () => void;
// }
const DataPopup = ({
  // data,
  id,
  onClose,
  user,
  position,
  size,
  // onDataChange
}: {
    // data: any;
    id: number;
    onClose: () => void;
    user?: any;
    position: { top: number; left: number };
    size: { width: number; height: number };
    // onDataChange?: () => void;
}) => {
  /**
   * @state
   * @description Main state management for popup content
   */
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState("");
  const [isAddTagPopupOpen, setIsAddTagPopupOpen] = useState(false);
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAnimationState, setLoadingAnimationState] = useState("loading");

  /**
   * @state
   * @description Animation state for smooth opening
   */
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);

  /**
   * @state
   * @description Form data management
   */
  const [formData, setFormData] = useState({
    question: "",
    answers: [] as string[],
    tags: [] as { group: string; tag: string }[],
  });

  /**
   * @function handleChange
   * @description Updates form data for given field
   */
  const handleChange = (field: string, value: string | string[] | { group: string; tag: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchInitialData = async() => {
    try {
      const fetchedData = await fetchQueryWithAnswers(id);
      if (fetchedData && fetchedData.answers) {
        setAnswers(fetchedData.answers);
        setTagGroups(fetchedData.tags);
        setQuestion(fetchedData.question);
      } else {
        console.warn("No answers found for this query.");
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  /**
   * @function useEffect
   * @description Sets up initial data and animation
   */
  useEffect(() => {
    fetchInitialData();
    setTimeout(() => {
      setIsTransitionComplete(true);
    }, 50);

    // setAnswers(data.answers || []);
    // setTagGroups(data.tags || []);
  }, []);

  // useEffect(() => {
  //   if (data?.answers) {
  //     setAnswers(data.answers);
  //   }
  // }, [data]);

  /**
   * @function handleConfirmDelete
   * @description Processes answer deletion
   */
  const handleConfirmDelete = async(itemId: number) => {
    const result = await handleDeleteQueryAnswer(itemId);
    if (result) {
      setAnswers((prevAnswers: any[]) => prevAnswers.filter((answer) => answer.id !== itemId));
    }
  };

  /**
   * @function handleAddAnswer
   * @description Handles adding new answer with validation
   */
  const handleAddAnswer = async() => {
    if (!newAnswer.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }
    if (!user?.id) {
      setError("User information not available");
      return;
    }
    setLoadingAnimationState("loading");
    setLoading(true);
    const result = await handleAddNewQueryAnswer(newAnswer, user.id, id);

    if (result.success) {
      // setAnswers((prevAnswers: any[]) => [
      //   ...prevAnswers,
      //   {
      //     id: Date.now(),
      //     answer: newAnswer,
      //     createdAt: new Date().toString(),
      //     email: user.email,
      //     firstName: user.firstName,
      //     roleName: user.roles[0].roleName,
      //     updatedAt: formatDate(new Date().toString()),
      //     usersId: user.id,
      //     usersUsername: user.username,
      //   },
      // ]);
      // setNewAnswer("");

      await fetchInitialData();
      setIsAddModalOpen(false);
      setLoadingAnimationState("success");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setLoading(false);
  };

  /**
   * @function handleCancelAdd
   * @description Cancels adding new answer
   */
  const handleCancelAdd = () => {
    setNewAnswer("");
    setIsAddModalOpen(false);
  };

  /**
   * @function handleAddTags
   * @description Processes adding new tags
   */
  const handleAddTags = async(newTag: { group: string; tag: string }) => {
    setLoadingAnimationState("loading");
    setLoading(true);
    const tagPayload = { tagGroupName: newTag.group, tagName: newTag.tag };
    const result = await handleAddNewTagToExistingQuery(id.toString(), tagPayload);

    if (result.success) {
      setLoadingAnimationState("success");
      await fetchInitialData();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // onDataChange?.();

      // setTagGroups((prevTagGroups) => {
      //   const updatedTagGroups = [...prevTagGroups];
      //   updatedTagGroups.push({ tagGroupName: newTag.group, tagNames: newTag.tag });
      //   return updatedTagGroups;
      // });
      setLoading(false);
      setIsAddTagPopupOpen(false);
    } else {
      console.error("Failed to add tag to the backend.");
    }
  };

  /**
   * @function handleRemoveTag
   * @description Removes tag from display
   */
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

            <h2>{question}</h2>
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
                  queryId={id}
                  userId={user.id}
                  onDataChange={fetchInitialData}
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
              {loading ? (<LottieLoader state={loadingAnimationState} size={"250px"}/>) : (
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
