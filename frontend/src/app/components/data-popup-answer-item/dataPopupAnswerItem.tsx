'use client';

import React, { useState } from 'react';
import { formatDate } from '@/app/util/formatDate';
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import editAnimation from "../../../../public/assets/animatedIcons/edit.json";
import deleteAnimation from "../../../../public/assets/animatedIcons/delete.json";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import saveAnimation from "../../../../public/assets/animatedIcons/save.json";
import { handleEditQuery, handleCopyQuery } from '@/app/util/query/queryFunctionalities';
import { Button } from '@mui/material';
import styles from './DataPopupAnswerItem.module.css';

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
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [copyOverlayVisible, setCopyOverlayVisible] = useState(false);


    const handleCopy = async (text: string, id: number) => {
        try {
            await handleCopyQuery(id);
            await navigator.clipboard.writeText(text);
            setCopyOverlayVisible(true);
            setTimeout(() => {
                setCopyOverlayVisible(false);
            }, 3000);

        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleRightClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const { clientX: x, clientY: y } = event;
        setContextMenu({ x, y, visible: true });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleEdit = () => {
        setEditing(true);
        handleCloseContextMenu();
    };

    const handleSaveEdit = async () => {
        setEditing(false);
        await handleEditQuery(answer.id, editedAnswer, 1, 1);
    };

    const handleCancelEdit = () => {
        setEditedAnswer(answer.answer);
        setEditing(false);
    };

    const handleDeleteClick = () => {
        setDeletingItemId(answer.id);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleCancelDelete = () => {
        setIsSlidingOut(true);
        setTimeout(() => {
            setDeletingItemId(null);
            setIsSlidingOut(false);
        }, 300);
    };

    const handleConfirmDelete = async () => {
        await onDelete(answer.id);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element | null;
        if (target && !target.closest(`.${styles.answerItem}`)) {
            handleCloseContextMenu
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <li
            className={styles.answerItem}
            onContextMenu={handleRightClick} // Trigger right-click menu
        >
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
                            onClick={handleSaveEdit}
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
            )}
            {contextMenu.visible && (
                <div
                    className={styles.contextMenu}
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                    onClick={handleCloseContextMenu}
                >
                    <ul>
                        <li onClick={handleEdit}>Edit</li>
                        <li onClick={handleDeleteClick}>Delete</li>
                    </ul>
                </div>
            )}

            {copyOverlayVisible && (
                <div className={`${styles.copyOverlay} ${copyOverlayVisible ? '' : styles['slide-out']}`}>
                    Copied!
                </div>
            )}
            {deletingItemId === answer.id && (
                <div className={`${styles.deleteConfirmationOverlay} ${isSlidingOut ? 'slide-out' : ''}`}>
                    <div className={styles.confirmationMessage}>
                        Are you sure you want to delete this answer?
                    </div>
                    <div className={styles.actionButtons}>
                        <Button onClick={handleCancelDelete}>Cancel</Button>
                        <Button onClick={handleConfirmDelete}>Confirm</Button>
                    </div>
                </div>
            )}
        </li>
    );
}
    
    export default DataPopupAnswerItem;
