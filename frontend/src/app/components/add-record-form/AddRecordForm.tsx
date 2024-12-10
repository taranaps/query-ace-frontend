'use client';


import React, { useState } from 'react';
import styles from '../add-record-form/AddRecordForm.module.css';




const AddRecordForm = () => {
  // Define state for each input field
  const [keyword, setKeyword] = useState('');
  const [tags, setTags] = useState('');
  const [question, setQuestion] = useState('');
  const [query, setQuery] = useState('');


  // Handle input changes
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value);
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value);
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value);


  // Clear all fields
  const handleClear = () => {
    setKeyword('');
    setTags('');
    setQuestion('');
    setQuery('');
    alert("Clear all fields?");
  };


  // Save the form data
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission to handle saving here
    if (keyword && tags && question && query) {
      alert("Data is saved!");
      // Here, you can implement logic to save the data, such as sending it to an API
    } else {
      alert("Please fill in all fields!");
    }
  };


  return (
    <form className={styles.addRecordForm} onSubmit={handleSave}>
      {/* Keyword Input */}
      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Keyword"
        value={keyword}
        onChange={handleKeywordChange}
      />


      {/* Tags Input */}
      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Tags"
        value={tags}
        onChange={handleTagsChange}
      />


      {/* Question Input */}
      <input
        type="text"
        className={`${styles.inputField} ${styles.small}`}
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
      />


      {/* Query Input */}
      <textarea
        className={`${styles.inputField} ${styles.large}`}
        placeholder="Query"
        rows={9}
        value={query}
        onChange={handleQueryChange}
      ></textarea>


      {/* Buttons */}
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
    </form>
  );
};


export default AddRecordForm;
