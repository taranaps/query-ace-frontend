'use client';

import React, { useState } from 'react';
import styles from '../add-record-form/AddRecordForm.module.css';

const AddRecordForm = () => {

  const [keyword, setKeyword] = useState('');
  const [tags, setTags] = useState('');
  const [question, setQuestion] = useState('');
  const [query, setQuery] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value);
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value);
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value);


  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setAnswers(updatedAnswers);
  };


  const handleAddAnswer = () => {
    setAnswers([...answers, '']); // Add a new empty string to answers array
  };


  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_, i) => i !== index); // Remove answer at the given index
    setAnswers(updatedAnswers);
  };


  const handleClear = () => {
    setKeyword('');
    setTags('');
    setQuestion('');
    setQuery('');
    setAnswers([]);
    alert("Clear all fields?");
  };


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword && tags && question && query && answers.length > 0) {
      alert("Data is saved!");
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <form className={styles.addRecordForm} onSubmit={handleSave}>

      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Keyword"
        value={keyword}
        onChange={handleKeywordChange}
      />

      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Tags (Optional)"
        value={tags}
        onChange={handleTagsChange}
      />

      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
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
        <button type="button" className={styles.downloadBtn}>
          Download Template
          <img
            src="/download.png"
            alt="Download Template"
            className={styles.buttonIcon}
          />
        </button>
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
