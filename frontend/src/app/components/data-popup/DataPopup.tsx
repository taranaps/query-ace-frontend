import React, { useState } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton"; // Import LottieIconButton component
import styles from './popup.module.css';

// Import Lottie animations
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";

const DataPopup = ({
    data,
    onClose,
    onEdit,
    onDelete,
}: {
    data: any;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (itemId:number) => void;
}) => {
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    const handleDeleteClick = (itemId: number) => {
        setDeletingItemId(itemId); // Set the item to be deleted
    };

    const handleCancelDelete = () => {
        setDeletingItemId(null); // Reset to cancel deletion
    };

    const handleConfirmDelete = (itemId: number) => {
        onDelete(itemId); // Call the onDelete function passed as a prop
        setDeletingItemId(null); // Reset after deletion
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <div className={styles.popupHeader}>
                    <h2>{data.question}</h2>
                    <LottieIconButton
                        animationData={closeAnimation}
                        label="Close"
                        onClick={onClose}
                    />
                </div>

                <h3 className={styles.answerTitle}>Answers:</h3>
                <div className={styles.answerContainer}>
                    {data.answers.length > 0 ? (
                        <ul className={styles.answerList}>
                            {data.answers.map((answer: any, index: number) => (
                                <li key={index} className={styles.answerItem}>
                                    <p>{answer.answer}</p>
                                    <div className={styles.actionButtons}>
                                        <LottieIconButton
                                            animationData={copyAnimation}
                                            label="Copy Answer"
                                            onClick={() => handleCopy(answer.answer)}
                                        />
                                        <LottieIconButton
                                            animationData={editAnimation}
                                            label="Edit"
                                            onClick={onEdit}
                                        />
                                        <LottieIconButton
                                            animationData={deleteAnimation}
                                            label="Delete"
                                            onClick={() => handleDeleteClick(answer.id)}
                                        />
                                    </div>

                                    {/* Confirm delete overlay */}
                                    {deletingItemId === answer.id && (
                                        <div className={styles.deleteConfirmationOverlay}>
                                            <div className={styles.confirmationMessage}>
                                                Are you sure you want to delete this answer?
                                            </div>
                                            <div className={styles.confirmationButtons}>
                                                <button
                                                    className={styles.cancelButton}
                                                    onClick={handleCancelDelete}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={() => handleConfirmDelete(answer.id)}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No answers available.</p>
                    )}
                </div>

                <div className={styles.dataCardTags}>
                    {data.tags.length > 0 ? (
                        data.tags.map((tag: any, index: number) => (
                            <div key={index} className={styles.tag}>
                                <div className={styles.tagGroup}>
                                    {tag.tagGroupName}
                                </div>
                                <div className={styles.tagName}>
                                    {tag.tagName}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.tag}>No tags available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataPopup;
