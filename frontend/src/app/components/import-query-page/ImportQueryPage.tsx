'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Typography } from '@mui/material';
import styles from './ImportQueryPage.module.css';
import DataCardImport from '../dashboard-datacard copy/DataCardImport';
import QueryTagInterface from '@/app/interface/query/queryTagInterface';

interface ProcessedDataType {
  question: string;
  userId: number;
  tags: QueryTagInterface[];
  answers: { answer: string; userId: number }[];
}

const ImportQueryPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<ProcessedDataType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as ArrayBuffer;
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const mergedCells = worksheet['!merges'] || [];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<(string | number)[]>;

        mergedCells.forEach((merge) => {
          const start = merge.s;
          const value = jsonData[start.r]?.[start.c];
          if (value !== undefined) {
            for (let r = start.r; r <= merge.e.r; r++) {
              jsonData[r][start.c] = value;
            }
          }
        });

        const nonEmptyRows = jsonData.filter((row) =>
          Array.isArray(row) &&
          row.some((cell) => cell !== undefined && String(cell).trim() !== '')
        );

        const rows: (string | number)[][] = nonEmptyRows;

        const processedData: ProcessedDataType[] = [];

        let lastQuestionIndex = -1;
        let lastCategory = '';
        let lastCompany = '';

        rows.slice(1).forEach((row) => {
          const question = row[0] ? String(row[0]) : null;
          const answer = row[1] ? String(row[1]) : 'No Response';

          if (row[2]) {
            lastCategory = String(row[2]);
          }
          if (row[3]) {
            lastCompany = String(row[3]);
          }

          if (question) {
            // New question
            const tags: QueryTagInterface[] = [];
            if (lastCategory) {
              tags.push({ tagGroupName: 'Category', tagName: lastCategory });
            }
            if (lastCompany) {
              tags.push({ tagGroupName: 'Company', tagName: lastCompany });
            }

            const existingQuestion = processedData.find((data) => data.question === question);
            if (existingQuestion) {
              existingQuestion.answers.push({ answer, userId: 0 });
            } else {
              processedData.push({
                question,
                userId: 0,
                tags,
                answers: [{ answer, userId: 0 }],
              });
            }

            lastQuestionIndex = processedData.length - 1;
          }
        });

        setQuestions(processedData);
        setError(null);
      };

      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleClear = () => {
    setFile(null);
    setQuestions([]);
    setError(null);
  };

  const handleSave = () => {
    console.log('Processed Data:', questions);
    alert('Data successfully saved!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.dataCardsContainer}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <DataCardImport
              key={index}
              id={index + 1}
              question={question.question}
              customer={question.tags.find((tag) => tag.tagGroupName === 'Company')?.tagName || ''}
              createdBy="System"
              createdAt={new Date().toISOString().split('T')[0]}
              answers={question.answers}
              tags={question.tags}
              onDelete={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
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
      <div className={styles.footer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClear}
          disabled={!file && questions.length === 0}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color={questions.length > 0 ? 'success' : 'info'}
          onClick={() =>
            questions.length > 0 ? handleSave() : document.getElementById('fileInput')?.click()
          }
        >
          {questions.length > 0 ? 'Save Data' : 'Import File'}
          <input
            id="fileInput"
            type="file"
            hidden
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
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
