'use client';

import React, { useState } from 'react';

import { formatDate } from '@/app/util/formatDate';

import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import editAnimation from "../../../../public/assets/animatedIcons/editv2.json"; 
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json"

import styles from './DataPopupAnswerItem.module.css';
import { handleDeleteQueryAnswer, handleEditQuery, handleCopyQuery } from '@/app/util/query/queryFunctionalities';

interface Answer {
    id: number;
    answer: string;
    usersId: number;
    usersUsername: string;
    email: string;
    firstName: string;
    roleName: string;
    createdAt: string;
    updatedAt: string;
}

interface DataPopupAnswerItemProps {
    answer: Answer;
    onDelete: (itemId: number) => Promise<void>
}

const DataPopupAnswerItem: React.FC<DataPopupAnswerItemProps> = ({
    answer,
    onDelete
}) => {
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
    const [editing, setEditing] = useState(false);
    const [editedAnswer, setEditedAnswer] = useState(answer.answer);
    const [isSlidingOut, setIsSlidingOut] = useState(false);


    const handleCopy = async (text: string, id: number) => {

        try {
            await handleCopyQuery(id);
            await navigator.clipboard.writeText(text);
            alert('Answer copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text:', err);
            alert('Failed to copy text.');
        }
    };

    const handleEdit = () => setEditing(true);

    const handleSaveEdit = async () => {
        setEditing(false);
        await handleEditQuery(answer.id, editedAnswer, 1, 1);
    };

    const handleCancelEdit = () => {
        setEditedAnswer(answer.answer);
        setEditing(false);
    };

    const handleDeleteClick = () => setDeletingItemId(answer.id);

    const handleCancelDelete = () => {
        setIsSlidingOut(true);
        setTimeout(() => {
            setDeletingItemId(null);
            setIsSlidingOut(false);
        }, 300);
    };

    const handleConfirmDelete = async () => {
        await onDelete(answer.id)
    };

    return (
        <li className={styles.answerItem}>
            {editing ? (
                <div className={styles.answerItemTop}>
                    <input
                        type="text"
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        className={styles.editInput}
                    />
                    <div className={styles.actionButtons}>
                        <LottieIconButton
                            animationData={saveAnimation}
                            label="Save"
                            onClick={() => handleSaveEdit()}
                        />
                        <LottieIconButton
                            animationData={closeAnimation}
                            label="Close"
                            onClick={handleCancelEdit}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.answerItemTop}>
                        <p>{answer.answer}</p>
                        <div className={styles.actionButtons}>
                            <LottieIconButton
                                animationData={copyAnimation}
                                label="Copy Answer"
                                onClick={() => handleCopy(answer.answer, answer.id)}
                            />
                            <LottieIconButton
                                animationData={editAnimation}
                                label="Edit"
                                onClick={handleEdit}
                            />
                            <LottieIconButton
                                animationData={deleteAnimation}
                                label="Delete"
                                onClick={handleDeleteClick}
                            />
                        </div>
                    </div>
                    <div className={styles.answerItemBottom}>
                        <span>Updated By: {answer.usersUsername}</span> |{" "}
                        <span>Updated At: {formatDate(answer.createdAt)}</span>
                    </div>
                </>
            )
            }
            {
                deletingItemId === answer.id && (
                    <div
                        className={`${styles.deleteConfirmationOverlay} ${isSlidingOut ? 'slide-out' : ''
                            }`}
                    >
                        <div className={styles.confirmationMessage}>
                            Are you sure you want to delete this answer?
                        </div>
                        <div className={styles.actionButtons}>
                            <LottieIconButton
                                animationData={closeAnimation}
                                label="Cancel"
                                onClick={handleCancelDelete}
                            />
                            <LottieIconButton
                                animationData={editAnimation}
                                label="Confirm"
                                onClick={handleConfirmDelete}
                            />
                        </div>
                    </div>
                )
            }
        </li >
    );
};

export default DataPopupAnswerItem;

