import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import styles from './ImportQueryPage.module.css'; // Import the CSS module

const ImportFilesPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  // Handle save button click
  const handleSave = () => {
    alert("Successfully saved data!");
  };

 

  useEffect(() => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImagePreview(objectURL);

      // Clean up the object URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [file]);

  return (
    <Box className={styles.container}>
      {/* Image Preview Section */}
      <Box className={styles.previewBox}>
        <img 
          src={imagePreview || "/images.png"} 
          alt="Image preview" 
          className={styles.previewImage} 
        />
      </Box>

      {/* Select, Save and Clear Buttons */}
      <Box className={styles.buttonBox}>
        <Button 
          variant="contained" 
          color="info" 
          className={styles.selectButton}
          sx={{ textTransform: 'none', marginLeft: '20px' }}
          onClick={() => document.getElementById("fileInput")?.click()} // Open file picker
        >
          Select File
          <img
            src="/selectfile.png"
            alt="Select Icon"
            className={styles.buttonIcon}
          />
          <input
            id="fileInput"
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        
        <Button
          variant="contained"
          color="success"
          className={`${styles.button} ${styles.saveButton}`}
          sx={{ textTransform: 'none', marginLeft: '20px'}}
          onClick={handleSave}
        >
          Save Data
          <img
            src="/tick.png"
            alt="Save Icon"
            className={styles.buttonIcon}
          />
        </Button>

      
      </Box>
    </Box>
  );
};

export default ImportFilesPage;



