import React from "react";
import styles from "./messagePopup.module.css";
import NewButton from "../new-button/NewButton";

const MessagePopup = ({ message, buttonLabel, buttonFunction }: { message: string, buttonLabel:string, buttonFunction : () => void }) => {
  return (
    <div className={styles.messagePopup}>
      <div className={styles.messagePopupContent}>
        <h3>{message}</h3>
        <NewButton variant="custom" onClick={buttonFunction} width="fit" type="button">
          {buttonLabel}
        </NewButton>
      </div>
    </div>
  );
};
export default MessagePopup;
