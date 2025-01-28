import React, { useState } from "react";
import {
  TextField,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddTagPopup from "../add-tag-popup/AddTagPopup";
import styles from "./AddRecordForm.module.css";
import { postQueryWithAnswers } from "@/app/api/queries/postQueryWithAnswers";
import PostQueryQuestionInetface from "@/app/interface/query/postQueryQuestionInterface";
import PostQueryAnswerInterface from "@/app/interface/query/postQueryAnswerInterface";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import { useAuth } from "@/context/AuthContext";
import NewButton from "../new-button/NewButton";

const AddRecordForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    question: "",
    answers: [] as string[],
    tags: [] as { group: string; tag: string }[],
  });

  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnimationState, setLoadingAnimationState] = useState("loading");

  const handleChange = (field: string, value: string | string[] | { group: string; tag: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAnswer = () => handleChange("answers", [...formData.answers, ""]);
  const handleRemoveAnswer = (index: number) => handleChange("answers", formData.answers.filter((data, i) => i !== index));

  const handleAnswerChange = (value: string, index: number) => handleChange(
    "answers",
    formData.answers.map((answer, i) => (i === index ? value : answer))
  );

  const handleAddTag = (tag: { group: string; tag: string }) => {
    handleChange("tags", [...formData.tags, tag]);
    setIsTagPopupOpen(false);
  };

  const handleRemoveTag = (index: number) => handleChange("tags", formData.tags.filter((data, i) => i !== index));

  const handleSave = async(e: React.FormEvent) => {
    e.preventDefault();
    const { question, answers, tags } = formData;

    if (!question || answers.length === 0) {
      // MessagePopup({"Please fill in the question and at least one answer", "OK", () => {}});
      return;
    }

    const questionData: PostQueryQuestionInetface[] = [
      {
        question,
        userId: user.id,
        tags: tags.map((tag) => ({
          tagName: tag.tag,
          tagGroupName: tag.group,
        })),
      },
    ];

    const answersData: PostQueryAnswerInterface[] = answers.map((answer) => ({
      answer,
      userId: user.id,
    }));

    setLoadingAnimationState("loading");
    setIsLoading(true);

    try {
      await postQueryWithAnswers(questionData, answersData);
      setLoadingAnimationState("success");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      handleClear();
    } catch (error) {
      setLoadingAnimationState("failed");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => setFormData({ question: "", answers: [], tags: [] });

  return (
    <form className={styles.addRecordForm} onSubmit={handleSave}>
      {isLoading ? (
        <LottieLoader
          size={"240px"}
          state={loadingAnimationState}
        />
      ) : (
        <>
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
            className={styles.inputField}
          />

          <div className={styles.tagSection}>
            <NewButton
              variant="custom"
              onClick={() => setIsTagPopupOpen(true)}
            >
              Add Tags +
            </NewButton>
            <div className={styles.tagsList}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`${tag.group}: ${tag.tag}`}
                  onDelete={() => handleRemoveTag(index)}
                  className={styles.tagItem}
                  sx={{
                    "& .MuiChip-deleteIcon": {
                      color: "#ff4d4f",
                    },
                    "&:hover .MuiChip-deleteIcon": {
                      color: "white",
                    },
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.answers}>
            <div className={styles.answersAndAddButton}>
              <Typography>Answers</Typography>
              <IconButton onClick={handleAddAnswer}>
                <AddIcon />
              </IconButton>
            </div>
            <div className={styles.answersList}>
              {formData.answers.map((answer, index) => (
                <div key={index} className={styles.answerItem}>
                  <TextField
                    label={`Answer ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={answer}
                    onChange={(e) => handleAnswerChange(e.target.value, index)}
                    className={styles.inputField}
                  />
                  <IconButton onClick={() => handleRemoveAnswer(index)} color="secondary">
                    <RemoveIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <NewButton
              variant="cancel"
              onClick={handleClear}

            >
              Clear
            </NewButton>
            <NewButton
              variant="submit"
              type="submit">
              Save
            </NewButton>
          </div>

          <AddTagPopup
            open={isTagPopupOpen}
            onClose={() => setIsTagPopupOpen(false)}
            onAddTags={handleAddTag}
          />
        </>
      )}
    </form>
  );
};

export default AddRecordForm;
