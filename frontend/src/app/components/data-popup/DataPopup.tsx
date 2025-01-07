import React, { useState, useEffect } from "react";
import LottieIconButton from "../lottie-animated-button/LottieIconButton";
import styles from './popup.module.css';
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";
import DataPopupAnswerItem from "../data-popup-answer-item/dataPopupAnswerItem";
import { handleDeleteQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { handleAddNewQueryAnswer } from "@/app/util/query/queryFunctionalities";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import AddTagPopup from "../add-tag-popup/AddTagPopup";
import fetchAllTagDetails from "@/app/api/tags/route.ts";
import { formatDate } from "@/app/util/formatDate";

const DataPopup = ({
    data,
    onClose,
    user
}: {
    data: any;
    onClose: () => void;
    user?: any
}) => {
    const [answers, setAnswers] = useState(data.answers);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAnswer, setNewAnswer] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAddTagPopupOpen, setIsAddTagPopupOpen] = useState(false);
    const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string[] }[]>([]);

    useEffect(() => {
        setAnswers(data.answers);
        const fetchTags = async () => {
            const tags = await fetchAllTagDetails();
            setTagGroups(tags);
        };

        fetchTags();
    }, [data]);

    const handleConfirmDelete = async (itemId: number) => {
        const result = await handleDeleteQueryAnswer(itemId);
        if (result) {
            setAnswers((prevAnswers: any[]) => prevAnswers.filter((answer) => answer.id !== itemId));
        }
    };

    const handleAddAnswer = async () => {
        if (!newAnswer.trim()) {
            setError("Please enter an answer before submitting.");
            return;
        }

        setLoading(true);
        setError("");

        const result = await handleAddNewQueryAnswer(newAnswer, 1, data.id);
        setLoading(false);

        if (result.success) {

            console.log(user);

            setAnswers((prevAnswers: any[]) => [
                ...prevAnswers,
                {
                    id: 32,
                    answer: newAnswer,
                    createdAt: formatDate(new Date().toString()),
                    email: user.email,
                    firstName: user.firstName,
                    roleName: user.roles[0].roleName,
                    updatedAt: formatDate(new Date().toString()),
                    usersId: user.id,
                    usersUsername: user.username,
                },
            ]);
            setNewAnswer("");
            setIsAddModalOpen(false);
        }
    };

    const handleCancelAdd = () => {
        setNewAnswer("");
        setIsAddModalOpen(false);
    };

    const handleAddTags = (newTag: { group: string; tag: string }) => {
        setTagGroups((prevTagGroups: { tagGroupName: string; tagNames: string[] }[]) => {
            const updatedTagGroups = [...prevTagGroups];
            const groupIndex = updatedTagGroups.findIndex(group => group.tagGroupName === newTag.group);
            if (groupIndex > -1) {
                updatedTagGroups[groupIndex].tagNames.push(newTag.tag);
            }
            return updatedTagGroups;
        });
        setIsAddTagPopupOpen(false);
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
                    {answers.length > 0 ? (
                        <ul className={styles.answerList}>
                            {answers.map((answer: any) => (
                                <DataPopupAnswerItem
                                    key={answer.id}
                                    answer={answer}
                                    onDelete={handleConfirmDelete}
                                />
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
                    <button
                        className={styles.addTagButton}
                        onClick={() => setIsAddTagPopupOpen(true)}
                    >
                        + Add Tag
                    </button>
                </div>

                <div className={styles.addAnswerButton}>
                    <button onClick={() => setIsAddModalOpen(true)}>Add Answer</button>
                </div>

                {isAddModalOpen && (
                    <div className={styles.addAnswerModal}>
                        <div className={styles.modalContent}>
                            {loading ? (<LottieLoader />) : (
                                <>
                                    <h3>Add a New Answer</h3>
                                    <textarea
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                        placeholder="Write your answer..."
                                        rows={4}
                                    />
                                    {error && <p className={styles.error}>{error}</p>}
                                    <div className={styles.modalActions}>
                                        <button onClick={handleAddAnswer} disabled={loading}>
                                            Add
                                        </button>
                                        <button onClick={handleCancelAdd}>Cancel</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <AddTagPopup
                    open={isAddTagPopupOpen}
                    onClose={() => setIsAddTagPopupOpen(false)}
                    onAddTags={handleAddTags}
                />
            </div>
        </div>
    );
};

export default DataPopup;
