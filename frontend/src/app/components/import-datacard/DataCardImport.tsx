"use client";

import { formatDate } from "@/app/util/formatDate";

import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";
import styles from "./datacard.module.css";

interface DataCardProps {
  id: number;
  question: string;
  answers: { answer: string; userId: number }[];
  tags: { tagName: string; tagGroupName: string }[];
  onDelete: () => void;
  onClick: () => void;
}

const MAX_QUESTION_WORDS = 20;
const MAX_ANSWER_WORDS = 30;

const truncateText = (text: string | undefined, limit: number): string => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? `${words.slice(0, limit).join(" ")}...` : text;
};


const DataCardImport: React.FC<DataCardProps> = ({
  id,
  question,
  answers,
  tags,
  onDelete,
  onClick,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className={styles.dataCard} onClick={onClick}>
      <div className={styles.dataCardTop}>
        <div className={styles.dataCardQuestionAndAnswerContainer}>
          <p className={styles.dataCardQuestion}>
            Question: {truncateText(question, MAX_QUESTION_WORDS)}
          </p>
          <ul className={styles.dataCardAnswerContainer}>
            {answers.map((answerObj, index) => (
              <li key={index} className={styles.dataCardAnswer}>
                ▣ {truncateText(answerObj.answer, MAX_ANSWER_WORDS)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.dataCardFooter}>
        <div className={styles.dataCardDetails}>
          <div className={styles.dataCardTags}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                <div className={styles.tagGroup}>{tag.tagGroupName}</div>
                <div className={styles.tagName}>{tag.tagName}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dataCardActionButtons}>
          <div className={styles.dataCardActions}>
            <LottieIconButton
              animationData={deleteAnimation}
              label="Delete"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCardImport;
