import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddTagPopup from '../add-tag-popup/AddTagPopup';
import styles from './AddRecordForm.module.css';
import fetchAllTagDetails from '@/app/api/tags/fetchAllTagDetails';
import postQueryWithAnswers from '@/app/api/queries/postQueryWithAnswers';
import QuestionData from '../interface/query/queryQuestionInterface';
import AnswerData from '../interface/query/queryAnswerInterface';

const AddRecordForm = () => {
  const [formData, setFormData] = useState({
    question: '',
    answers: [] as string[],
    tags: [] as { group: string; tag: string }[],
  });

  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string[] }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await fetchAllTagDetails();
      setTagGroups(tags);
    };

    fetchTags();
  }, []);

  const handleChange = (field: string, value: string | string[] | { group: string; tag: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAnswer = () => handleChange('answers', [...formData.answers, '']);

  const handleRemoveAnswer = (index: number) => handleChange('answers', formData.answers.filter((_, i) => i !== index));

  const handleAnswerChange = (value: string, index: number) => handleChange(
    'answers',
    formData.answers.map((answer, i) => (i === index ? value : answer))
  );

  const handleAddTag = (tag: { group: string; tag: string }) => {
    handleChange('tags', [...formData.tags, tag]);
    setIsTagPopupOpen(false);
  };

  const handleRemoveTag = (index: number) => handleChange('tags', formData.tags.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { question, answers, tags } = formData;
  
    if (!question || tags.length === 0) {
      alert('Please fill in all required fields!');
      return;
    }
  
    const questionData: QuestionData[] = [
      {
        question,
        userId: 1, // Replace with actual user ID
        tags: tags.map((tag) => ({
          tagName: tag.tag,
          tagGroupName: tag.group,
        })),
      },
    ];
  
    const answersData: AnswerData[] = answers.map((answer) => ({
      answer,
      userId: 1, 
    }));
  
    try {
      await postQueryWithAnswers(questionData, answersData);
      alert('Data submitted successfully!');
      handleClear();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data.');
    }
  };
  

  const handleClear = () => setFormData({ question: '', answers: [], tags: [] });

  return (
    <form className={styles.addRecordForm} onSubmit={handleSave}>
      <TextField
        label="Question"
        variant="outlined"
        fullWidth
        value={formData.question}
        onChange={(e) => handleChange('question', e.target.value)}
        className={styles.inputField}
      />

      <div className={styles.tagSection}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsTagPopupOpen(true)}
        >
          Add Tags
        </Button>
        <div className={styles.tagsList}>
          {formData.tags.map((tag, index) => (
            <Chip
              key={index}
              label={`${tag.group}: ${tag.tag}`}
              onDelete={() => handleRemoveTag(index)}
              className={styles.tagItem}
              sx={{
                '& .MuiChip-deleteIcon': {
                  color: '#ff4d4f',
                },
                '&:hover .MuiChip-deleteIcon': {
                  color: 'white',
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
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </div>

      <AddTagPopup
        open={isTagPopupOpen}
        onClose={() => setIsTagPopupOpen(false)}
        tagGroups={tagGroups}
        onAddTags={handleAddTag}
      />
    </form>
  );
};

export default AddRecordForm;
