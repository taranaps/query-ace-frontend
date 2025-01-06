'use client';

import React, { useState } from 'react';

import * as XLSX from 'xlsx';
import row from 'xlsx'
import { Button, Typography } from '@mui/material';
import styles from './ImportQueryPage.module.css';
import DataCardDashboard from '../dashboard-datacard/DataCardDashboard';
import PostQueryQuestionInetface from '@/app/interface/query/postQueryQuestionInterface';
import PostQueryAnswerInterface from '@/app/interface/query/postQueryAnswerInterface';
import QueryTagInterface from '@/app/interface/query/queryTagInterface';

const ImportQueryPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<PostQueryQuestionInetface[]>([]);
  const [answers, setAnswers] = useState<PostQueryAnswerInterface[]>([]);
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
          const end = merge.e;
          const value = jsonData[start.r]?.[start.c];

          if (value !== undefined) {
            for (let R = start.r; R <= end.r; R++) {
              for (let C = start.c; C <= end.c; C++) {
                if (R !== start.r || C !== start.c) {
                  jsonData[R][C] = value;
                }
              }
            }
          }
        });

        const nonEmptyRows = jsonData.filter((row) =>
          Array.isArray(row) &&
          row.some((cell: string | number) => {
            return cell !== undefined && cell !== null && String(cell).trim() !== '';
          })
        );

        const rows: (string | number)[][] = nonEmptyRows;

        const processedQuestions: PostQueryQuestionInetface[] = [];
        const processedAnswers: PostQueryAnswerInterface[] = [];

        let lastCategory = '';
        let lastCompany = '';

        rows.slice(1).forEach((row, index) => {
          const question = row[0] ? String(row[0]) : 'No Question';
          const response = row[1] ? String(row[1]) : 'No Response';

          if (row[2]) {
            lastCategory = String(row[2]);
          }
          if (row[3]) {
            lastCompany = String(row[3]);
          }

          const tags: QueryTagInterface[] = [];
          if (lastCategory) {
            tags.push({ tagGroupName: 'Category', tagName: lastCategory });
          }
          if (lastCompany) {
            tags.push({ tagGroupName: 'Company', tagName: lastCompany });
          }

          processedQuestions.push({
            question,
            userId: 0,
            tags,
          });

          processedAnswers.push({
            answer: response,
            userId: 0,
            queryId: index + 1,
          });
        });

        setQuestions(processedQuestions);
        setAnswers(processedAnswers);
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
    setAnswers([]);
    setError(null);
  };

  const handleSave = () => {
    console.log('Questions:', questions);
    console.log('Answers:', answers);
    alert('Data successfully saved!');
  };

  const handleDelete = (id: number) => {
    setQuestions((prev) => prev.filter((_, index) => index !== id));
    setAnswers((prev) => prev.filter((_, index) => index !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.dataCardsContainer}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <DataCardDashboard
              key={index}
              id={index + 1}
              question={question.question}
              customer={question.tags.find((tag) => tag.tagGroupName === 'Company')?.tagName || ''}
              createdBy="System"
              createdAt={new Date().toISOString().split('T')[0]}
              answer={answers[index]?.answer || 'No Answer'}
              tags={question.tags}
              deleteOn={true}
              copyOn={true}
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
        <div className={styles.footerLeft}>
          <p>Having trouble with importing excel?</p>
          <a href="/assets/templates/Import Query Template.xlsx">Download Template</a>
        </div>

        <div className={styles.footerRight}>
          <Button
            variant="contained"
            color="secondary"
            className={styles.clearButton}
            sx={{ textTransform: 'none', marginLeft: '10px' }}
            onClick={handleClear}
            disabled={!file && questions.length === 0}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            color={questions.length > 0 ? 'success' : 'info'}
            className={styles.selectButton}
            sx={{ textTransform: 'none' }}
            onClick={() =>
              questions.length > 0
                ? handleSave()
                : document.getElementById('fileInput')?.click()
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
        </div>

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
