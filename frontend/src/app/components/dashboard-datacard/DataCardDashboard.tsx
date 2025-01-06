"use client";

import React, { useState } from "react";
import { formatDate } from "@/app/util/formatDate";

import LottieIconButton from "../lottie-animated-button/LottieIconButton";

import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import cancelAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";

import { handleCopyQuery, handleDeleteQuery } from "@/app/util/query/queryFunctionalities";

import styles from "./datacard.module.css";

interface DataCardProps {
  id: number;
  question: string;
  answer: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  tags: { tagName: string; tagGroupName: string }[];
  deleteOn: boolean;
  copyOn: boolean;
  onClick?: () => Promise<void>;
}

const MAX_QUESTION_WORDS = 20;
const MAX_ANSWER_WORDS = 40;

const truncateText = (text: string | undefined, limit: number): string => {
  if (!text) return "";
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
  deleteOn,
  copyOn,
  onClick
}) => {
  
  const handleCopy = async (id: number, text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await handleCopyQuery(id);
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDelete = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    await handleDeleteQuery(id);
    alert("Query Deleted");
  };

  return (
    <div
      className={styles.dataCard}
      onClick={onClick ? onClick : undefined}
    >
      <div className={styles.dataCardTop}>
        <div className={styles.dataCardQuestionAndAnswerContainer}>
          <p className={styles.dataCardQuestion}>
            Question : {truncateText(question, MAX_QUESTION_WORDS)}
          </p>
          <div className={styles.dataCardAnswerContainer}>
            <p className={styles.dataCardAnswer}>
              {truncateText(answer, MAX_ANSWER_WORDS)}
            </p>
            <div className={styles.copyButton}>
              <LottieIconButton
                animationData={copyAnimation}
                label="Copy Answer"
                onClick={(e) => handleCopy(id, answer, e)}
              />
            </div>
          </div>
        </div>
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
          <span>Created At: {formatDate(createdAt)}</span>
        </div>
        <div className={styles.dataCardActionButtons}>
          <div className={styles.dataCardActions}>
            {deleteOn && (
              <LottieIconButton
                animationData={deleteAnimation}
                label="Delete"
                onClick={(e) => handleDelete(id, e)}
              />
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DataCardDashboard;
