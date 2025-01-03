"use client";

import React, { useState } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton"; // Import the LottieIconButton component
import styles from "./datacardwithquestion.module.css";

// Import Lottie animations
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import cancelAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";

interface DataCardProps {
    id: number;
    question: string;
    createdBy: string;
    tags: string[];
    editOn: boolean;
    deleteOn: boolean;
    copyOn: boolean;
    onEdit: (id: number, newQuestion: string, newTags: string[]) => void;
    onDelete: (id: number) => void;
    onClick?: () => void;

}

const DataCardWithQuestions: React.FC<DataCardProps> = ({
    id,
    question,
    createdBy,
    tags,
    editOn,
    deleteOn,
    copyOn,
    onEdit,
    onDelete,
    onClick
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [editableQuestion, setEditableQuestion] = useState(question);
    const [editableTags, setEditableTags] = useState(tags.join(", "));

    // Handle Copy to Clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(editableQuestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle Save Changes
    const handleSave = () => {
        setIsEditing(false);
        onEdit(id, editableQuestion, editableTags.split(", "));
    };

    // Handle Edit
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Handle Cancel Edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditableQuestion(question);
        setEditableTags(tags.join(", "));
    };

    return (
        <div
            className={styles.dataCard}
            onClick={onClick}

        >
            {isEditing ? (
                <div className={styles.dataCardTop}>
                    <input
                        type="text"
                        value={editableQuestion}
                        onChange={(e) => setEditableQuestion(e.target.value)}
                        className={styles.editableInput}
                    />
                    <input
                        type="text"
                        value={editableTags}
                        onChange={(e) => setEditableTags(e.target.value)}
                        className={styles.editableInput}
                    />
                </div>
            ) : (
                <div className={styles.dataCardTop}>
                    <p className={styles.dataCardText}>{editableQuestion}</p>
                    <p className={styles.dataCardTags}>Tags: {editableTags}</p>
                </div>
            )}

            <div className={styles.dataCardFooter}>
                <div className={styles.dataCardDetails}>
                    <span>Created By: {createdBy}</span>
                </div>
                <div className={styles.dataCardActions}>
                    <div className={styles.dataCardActionButtons}>
                        {copyOn && (
                            <LottieIconButton
                                animationData={copyAnimation}
                                label="Copy"
                                onClick={handleCopy}
                            />
                        )}
                        {editOn &&
                            (isEditing ? (
                                <>
                                    <LottieIconButton
                                        animationData={saveAnimation}
                                        label="Save"
                                        onClick={handleSave}
                                    />
                                    <LottieIconButton
                                        animationData={cancelAnimation}
                                        label="Cancel"
                                        onClick={handleCancelEdit}
                                    />
                                </>
                            ) : (
                                <LottieIconButton
                                    animationData={editAnimation}
                                    label="Edit"
                                    onClick={handleEdit}
                                />
                            ))}
                        {deleteOn && (
                            <LottieIconButton
                                animationData={deleteAnimation}
                                label="Delete"
                                onClick={() => onDelete(id)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataCardWithQuestions;
