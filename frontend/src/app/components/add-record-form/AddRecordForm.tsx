'use client';

import React, { useState } from 'react';
import styles from '../add-record-form/AddRecordForm.module.css';
import postQueryWithAnswers from '@/app/api/postQueriesWithAnswers/postQueryWithAnswers';

const AddRecordForm = () => {
  const [tags, setTags] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, '']);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_, i) => i !== index); // Remove answer at the given index
    setAnswers(updatedAnswers);
  };

  const handleClear = () => {
    setTags('');
    setQuestion('');
    setAnswers([]);
    alert('Clear all fields?');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tags && question && answers.length > 0) {
      const requestBody = {
        question,
        userId: 0,
        tags: tags.split(',').map(tag => ({
          tagName: tag.trim(),
          tagGroup: 1,
        })),
      };

      try {
        const result = await postQueryWithAnswers(requestBody);
        alert('Data saved successfully!');
        console.log(result);
        handleClear();
      } catch (error) {
        alert(`Error`);
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  return (
    <form className={styles.addRecordForm} onSubmit={handleSave}>
      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
      />

      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Tags (Comma-separated)"
        value={tags}
        onChange={handleTagsChange}
      />

      <div className={styles.answers}>
        <div className={styles.answersAndAddButton}>
          <p>Answers</p>
          <img
            src='/assets/icons/plus-gray-small.png'
            onClick={handleAddAnswer}
          />
        </div>

        <div className={styles.answersList}>
          {answers.map((answer, index) => (
            <div key={index} className={styles.answerItem}>
              <input
                type="text"
                className={`${styles.inputField} ${styles.small}`}
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(e, index)}
              />
              <img
                src='/assets/icons/cross-gray-small.png'
                onClick={() => handleRemoveAnswer(index)}
                className={styles.removeBtn}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.downloadBox}>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            Clear
            <img
              src="/error.png"
              alt="Clear Icon"
              className={styles.buttonIcon}
            />
          </button>

          <button type="submit" className={styles.saveBtn}>
            Save
            <img
              src="/tick.png"
              alt="Save Icon"
              className={styles.buttonIcon}
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddRecordForm;
