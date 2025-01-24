/**
 * @module DataCardDashboard
 * @description
 * A card component that displays query information in a structured format.
 * Features:
 * - Truncated question and answer display
 * - Copy functionality for answers
 * - Tag display
 * - Metadata footer
 * - Optimized with memo for performance
 */
"use client";
import React, { useCallback, memo } from "react";
import { formatDate } from "@/app/util/formatDate";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import { handleCopyQuery } from "@/app/util/query/queryFunctionalities";
import styles from "./datacard.module.css";

/**
 * @interface DataCardProps
 * @description
 * Properties required for the DataCardDashboard component
 * 
 * @property {number} id - Unique identifier for the query
 * @property {string} question - The query question text
 * @property {string} answer - The query answer text
 * @property {number} numberOfAnswers - Total count of answers
 * @property {string} customer - Customer information
 * @property {string} createdBy - Username of creator
 * @property {string} createdAt - Creation timestamp
 * @property {Array} tags - Array of tag objects with group and name
 * @property {boolean} deleteOn - Whether delete functionality is enabled
 * @property {boolean} copyOn - Whether copy functionality is enabled
 * @property {Function} onClick - Click handler for card
 */
interface DataCardProps {
  id: number;
  question: string;
  answer: string;
  numberOfAnswers: number;
  customer: string;
  createdBy: string;
  createdAt: string;
  tags: { tagName: string; tagGroupName: string }[];
  deleteOn: boolean;
  copyOn: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => Promise<void>;
}

/**
 * @constant {number} MAX_QUESTION_WORDS
 * @description Maximum number of words to show in question before truncating
 */
const MAX_QUESTION_WORDS = 40;

/**
 * @constant {number} MAX_ANSWER_WORDS
 * @description Maximum number of words to show in answer before truncating
 */
const MAX_ANSWER_WORDS = 20;

/**
 * @function truncateText
 * @description
 * Truncates text to a specified word limit and adds ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} limit - Maximum number of words to show
 * @returns {string} Truncated text with ellipsis if needed
 */
const truncateText = (text: string | undefined, limit: number): string =>
  text && text.split(" ").length > limit
    ? `${text.split(" ").slice(0, limit).join(" ")}...`
    : text || "";

/**
 * @component DataCardDashboard
 * @description
 * Displays a card showing query information including:
 * - Truncated question and answer
 * - Number of answers
 * - Copy functionality
 * - Tags
 * - Creation metadata
 * 
 * Uses memo for performance optimization
 */
const DataCardDashboard: React.FC<DataCardProps> = memo(
  ({
    id,
    question,
    answer,
    numberOfAnswers,
    customer,
    createdBy,
    createdAt,
    tags,
    copyOn,
    onClick,
  }) => {
    /**
     * @function handleCopy
     * @description
     * Handles copying answer to clipboard
     * - Prevents event propagation
     * - Records copy action
     * - Copies text
     * - Shows success message
     * 
     * @param {React.MouseEvent} event - Click event object
     */
    const handleCopy = useCallback(
      async(event: React.MouseEvent) => {
        event.stopPropagation();
        await handleCopyQuery(id);
        navigator.clipboard.writeText(answer);
        alert("Copied to clipboard!");
      },
      [id, answer]
    );

    return (
      <div className={styles.dataCard} onClick={onClick}>
        <div className={styles.dataCardTop}>
          <div className={styles.dataCardQuestionAndAnswerContainer}>
            <div className={styles.dataCardQuestionContainer}>
              <p className={styles.dataCardQuestionHeader}>
                Question:
              </p>
              <p className={styles.dataCardQuestion}>
                {truncateText(question, MAX_QUESTION_WORDS)}
              </p>
            </div>
            <div
              style={{
                height: "4px",
              }}
            ></div>
            <div className={styles.dataCardAnswerContainer}>
              <p className={styles.dataCardAnswerHeader}>Answers: ({numberOfAnswers})</p>
              <div className={styles.dataCardAnswer}>
                <p>
                  {truncateText(answer, MAX_ANSWER_WORDS)}
                </p>
                {copyOn && (
                  <div className={styles.copyButton}>
                    <LottieIconButton
                      animationData={copyAnimation}
                      label="Copy Answer"
                      onClick={handleCopy}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className={styles.dataCardTags}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                <div className={styles.tagGroup}>{tag.tagGroupName} -</div>
                <div className={styles.tagName}> {tag.tagName}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.dataCardFooter}>
          <div className={styles.dataCardDetails}>
            <span>Customer: {customer}</span> |{"none"}
            <span>Created By: {createdBy}</span> |{" "}
            <span>Created At: {formatDate(createdAt)}</span>
          </div>
          <div className={styles.divider1}></div>
        </div>
      </div>
    );
  }
);

DataCardDashboard.displayName = "DataCardDashboard";

export default DataCardDashboard;