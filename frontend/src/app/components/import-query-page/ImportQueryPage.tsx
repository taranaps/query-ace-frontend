'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { Box, Button, Typography } from '@mui/material';
import DataCardDashboard from '../dashboard-datacard/DataCardDashboard';
import styles from './ImportQueryPage.module.css';

interface DataCard {
  id: number;
  text: string;
  customer: string;
  createdBy: string;
  createdAt: string;
  description: string;
}

const ImportQueryPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataCards, setDataCards] = useState<DataCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle file change (Excel file upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process and map the JSON data to the DataCard format
        const processedData: DataCard[] = jsonData.slice(1).map((row, index) => ({
          id: index + 1,
          text: row[0] || 'No Question',
          customer: row[2] || 'Unknown Company',
          createdBy: 'System', // Example default value
          createdAt: new Date().toISOString().split('T')[0], // Current date
          description: row[1] || 'No Response',
        }));

        setDataCards(processedData);
        setError(null); // Clear any previous errors
      };

      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // Handle delete action for a card
  const handleDelete = (id: number) => {
    setDataCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Handle edit action for a card
  const handleEdit = (id: number) => {
    alert(`Edit card with ID: ${id}`);
  };

  // Handle copy action for a card
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  // Clear uploaded file and data
  const handleClear = () => {
    setFile(null);
    setDataCards([]);
    setError(null);
  };

  // Handle save action
  const handleSave = () => {
    alert('Data successfully saved!');
  };

  return (
    <div className={styles.container}>
      {/* Buttons Section */}


      <div className={styles.dataCardsContainer}>
        {dataCards.length > 0 ? (
          dataCards.map((card) => (
            <DataCardDashboard
              key={card.id}
              id={card.id}
              text={card.text}
              customer={card.customer}
              createdBy={card.createdBy}
              createdAt={card.createdAt}
              description={card.description}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onCopy={handleCopy}
            />
          ))
        ) : (
          <div className={styles.previewBox}>
            <img
              src="/assets/images/import-clipboard.png"
              alt="No Data"
              className={styles.previewImage}
            />
          </div>
        )}
      </div>
      <div className={styles.buttonBox}>
        <Button
          variant="contained"
          color={dataCards.length > 0 ? 'success' : 'info'}
          className={styles.selectButton}
          sx={{ textTransform: 'none' }}
          onClick={() =>
            dataCards.length > 0
              ? handleSave()
              : document.getElementById('fileInput')?.click()
          }
        >
          {dataCards.length > 0 ? 'Save Data' : 'Import File'}
          <input
            id="fileInput"
            type="file"
            hidden
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          color="secondary"
          className={styles.clearButton}
          sx={{ textTransform: 'none', marginLeft: '10px' }}
          onClick={handleClear}
          disabled={!file && dataCards.length === 0}
        >
          Clear
        </Button>

        {error && (
          <Typography color="error" className={styles.errorMessage}>
            {error}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ImportQueryPage;
