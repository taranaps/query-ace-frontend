'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
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

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData: DataCard[] = jsonData.slice(1).map((row, index) => {
          const rowData = row as (string | undefined)[]; 
          return {
            id: index + 1,
            text: rowData[0] || 'No Question',
            customer: rowData[2] || 'Unknown Company',
            createdBy: 'System',
            createdAt: new Date().toISOString().split('T')[0],
            description: rowData[1] || 'No Response',
          };
        });
        

        setDataCards(processedData);
        setError(null); 
      };

      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleDelete = (id: number) => {
    setDataCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleEdit = (id: number) => {
    alert(`Edit card with ID: ${id}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  const handleClear = () => {
    setFile(null);
    setDataCards([]);
    setError(null);
  };

  const handleSave = () => {
    alert('Data successfully saved!');
  };

  return (
    <div className={styles.container}>


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
              deleteOn={true}
              editOn={true}
              copyOn={false}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
