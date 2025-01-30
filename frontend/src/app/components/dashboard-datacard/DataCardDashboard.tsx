"use client";

import React, { useCallback, useState, useEffect } from "react";
import { formatDate } from "@/app/util/formatDate";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import { handleCopyQuery } from "@/app/util/query/queryFunctionalities";
import styles from "./datacard.module.css";
import { Check } from "lucide-react";

interface ToastProps {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed center-4  flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
      <Check className="h-4 w-4" />
      <span>Copied to clipboard!</span>
    </div>
  );
};

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
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleCopy = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        handleCopyQuery(id)
          .then(() => navigator.clipboard.writeText(answer))
          .then(() => setShowToast(true))
          .catch(console.error);
      },
      [id, answer]
    );

    return (
      <>
        <div className={styles.dataCard} onClick={onClick}>
          <div className={styles.dataCardTop}>
            <div className={styles.dataCardQuestionAndAnswerContainer}>
              <div className={styles.dataCardQuestionContainer}>
                <p className={styles.dataCardQuestionHeader}>Question:</p>
                <p className={styles.dataCardQuestion}>
                  {truncateText(question, MAX_QUESTION_WORDS)}
                </p>
              </div>
              <div style={{ height: "4px" }}></div>

              <div className={styles.dataCardAnswerContainer}>
                <p className={styles.dataCardAnswerHeader}>
                  Answers: ({numberOfAnswers})
                </p>

                <div className={styles.dataCardAnswer}>
                  <p>{truncateText(answer, MAX_ANSWER_WORDS)}</p>
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

        {showToast && <Toast onClose={() => setShowToast(false)} />}
      </>
    );
  }
);

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

DataCardDashboard.displayName = "DataCardDashboard";

export default DataCardDashboard;