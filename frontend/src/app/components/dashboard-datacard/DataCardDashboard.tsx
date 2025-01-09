"use client";

import React, { useCallback } from "react";
import { formatDate } from "@/app/util/formatDate";

import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";

import { handleCopyQuery } from "@/app/util/query/queryFunctionalities";

import styles from "./datacard.module.css";

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

const MAX_QUESTION_WORDS = 40;
const MAX_ANSWER_WORDS = 20;

const truncateText = (text: string | undefined, limit: number): string =>
  text && text.split(" ").length > limit
    ? `${text.split(" ").slice(0, limit).join(" ")}...`
    : text || "";

const DataCardDashboard: React.FC<DataCardProps> = React.memo(
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
    const handleCopy = useCallback(
      async (event: React.MouseEvent) => {
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

            <div className={styles.divider}></div>

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

        </div>
      </div>
    );
  }
);

export default DataCardDashboard;
