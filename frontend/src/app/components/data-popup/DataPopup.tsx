import styles from './popup.module.css';
import LottieIconButton from "../lottie-animated-button/LottieIconButton";

// Import Lottie animations
import copyAnimation from "../../../../public/assets/animatedIcons/copyv3.json";
import closeAnimation from "../../../../public/assets/animatedIcons/Close.json";

const DataPopup = ({ data, onClose }: { data: any; onClose: () => void }) => {
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

                <p>Tag:</p>
                {data.tags.length > 0 ? (
                    <ul>
                        {data.tags.map((tag: any, index: number) => (
                            <li key={index}>{tag.tagGroup}: {tag.tagName}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags available.</p>
                )}
                <br />
                <h3>Answers:</h3>
                <div className={styles.answerContainer}>

                    {data.answers.length > 0 ? (
                        <ul className={styles.answerList}>
                            {data.answers.map((answer: any, index: number) => (
                                <li key={index} className={styles.answerItem}>
                                    <p>{answer.answer}</p>
                                    <LottieIconButton
                                        animationData={copyAnimation}
                                        label="Copy Answer"
                                        onClick={() => handleCopy(answer.answer)}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No answers available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataPopup;
