"use client";

import React from "react";
import Button from "../button/Button";
import styles from "./datacard.module.css";

interface DataCardProps {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onCopy: (text: string) => void;
}

const DataCardDashboard: React.FC<DataCardProps> = ({
  id,
  text,
  customer,
  createdBy,
  createdAt,
  description,
  onDelete,
  onEdit,
  onCopy,
}) => {
  return (
    <div className={styles.dataCard}>
      <p className={styles.dataCardText}>{text}</p>
      <p className={styles.dataCardDescription}>{description}</p>
      <div className={styles.dataCardFooter}>
        <div className={styles.dataCardDetails}>
          <span>Customer: {customer}</span> | <span>Created By: {createdBy}</span> |{" "}
          <span>Date: {createdAt}</span>
        </div>
        <div className={styles.dataCardActions}>
          <Button
            backgroundColor="#D64545"
            label=""
            onClick={() => onDelete(id)}
            rightIconPath="/assets/icons/delete-white-small.png"
          />
          <Button
            backgroundColor="#6C9A8B"
            label=""
            onClick={() => onEdit(id)}
            rightIconPath="/assets/icons/edit-white-small.png"
          />
          <Button
            backgroundColor="#567899"
            label=""
            onClick={() => onCopy(text)}
            rightIconPath="/assets/icons/copy-white-small.png"
          />
        </div>
      </div>
    </div>
  );
};

export default DataCardDashboard;
