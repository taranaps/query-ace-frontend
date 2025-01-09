'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, Typography } from '@mui/material';
import styles from './ImportQueryPage.module.css';
import DataCardImport from '../dashboard-datacard copy/DataCardImport';
import QueryTagInterface from '@/app/interface/query/queryTagInterface';
import { handleAddNewBulkQueryAndAnswer } from '@/app/util/query/queryFunctionalities';
import { useAuth } from '@/context/AuthContext';
import fetchAllTagDetails from '@/app/api/tags/route.ts';
import { handleAddNewTag } from '@/app/util/tags/tagFunctionalities';
import NewButton from '../new-button/NewButton';


interface ProcessedDataType {
  question: string;
  userId: number;
  tags: QueryTagInterface[];
  answers: { answer: string; userId: number }[];
}

const CACHE_KEY = 'processedQuestions';
const CACHE_TIMESTAMP_KEY = 'cacheTimestamp';

const ImportQueryPage = () => {

  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<ProcessedDataType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cachedData && cachedTimestamp) {
      const parsedTimestamp = new Date(cachedTimestamp).getTime();
      const currentTime = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (currentTime - parsedTimestamp < twentyFourHours) {
        setQuestions(JSON.parse(cachedData));
      }
    }
  }, []);

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
            const tags: QueryTagInterface[] = [];
            if (lastCategory) {
              tags.push({ tagGroupName: 'Category', tagName: lastCategory });
            }
            if (lastCompany) {
              tags.push({ tagGroupName: 'Company', tagName: lastCompany });
            }

            const existingQuestion = processedData.find((data) => data.question === question);
            if (existingQuestion) {
              existingQuestion.answers.push({ answer, userId: user.id });
            } else {
              processedData.push({
                question,
                userId: user.id,
                tags,
                answers: [{ answer, userId: user.id }],
              });
            }
          }
        });

        setQuestions(processedData);
        setError(null);

        localStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
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
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  };


  const handleSave = async () => {
    try {
      const fetchTags = async () => {
        const tags = await fetchAllTagDetails();
        return tags;
      };

      const tagGroups = await fetchTags();

      const existingTags = new Set(
        tagGroups.flatMap((group: { tagGroupName: string; tagNames: string[] }) =>
          group.tagNames.map((tagName) => `${tagName}-${group.tagGroupName}`)
        )
      );

      const missingTags: { tagName: string; tagGroupName: string }[] = [];

      questions.forEach((question) => {
        question.tags.forEach((tag) => {
          const tagKey = `${tag.tagName}-${tag.tagGroupName}`;
          if (!existingTags.has(tagKey)) {
            missingTags.push(tag);
          }
        });
      });

      const uniqueMissingTags = Array.from(
        missingTags.reduce((map, tag) => {
          const key = `${tag.tagName}-${tag.tagGroupName}`;
          if (!map.has(key)) {
            map.set(key, tag);
          }
          return map;
        }, new Map()).values()
      );

      if (uniqueMissingTags.length > 0) {
        const userConfirmed = window.confirm(
          `The following tags are not in the database:\n${uniqueMissingTags
            .map((tag) => `- ${tag.tagGroupName}: ${tag.tagName}`)
            .join('\n')}\n\nDo you want to add these tags?`
        );

        if (userConfirmed) {

          for (const tag of uniqueMissingTags) {
            const added = await handleAddNewTag(tag);
            if (!added) {
              alert(`Failed to add tag: ${tag.tagGroupName} - ${tag.tagName}`);
              return;
            }
          }
        } else {
          alert('Save operation canceled by the user.');
          return;
        }
      }

      const saved = await handleAddNewBulkQueryAndAnswer(questions);
      if (saved) {
        alert('Data successfully saved!');
        handleClear();
      } else {
        alert('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('An error occurred during the save process:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };



  function handleDownloadTemplate(): void {
    throw new Error('Function not implemented.');
  }

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
    <div className={styles.leftButtons}>
        <NewButton
            variant="custom" // For the "Download Template" button
            onClick={handleDownloadTemplate}
            width="fit"
            type="button"
        >
            Download Template
        </NewButton>
    </div>
    <div className={styles.rightButtons}>
        <NewButton
            variant="cancel" // "Clear" button with the cancel style
            onClick={handleClear}
            disabled={!file && questions.length === 0}
            width="fit"
            type="button"
        >
            Clear
        </NewButton>
        <NewButton
            variant={questions.length > 0 ? 'submit' : 'info'} // "Save Data" or "Import File" button
            onClick={() =>
                questions.length > 0 ? handleSave() : document.getElementById('fileInput')?.click()
            }
            width="fit"
            type="button"
        >
            {questions.length > 0 ? 'Save Data' : 'Import File'}
            <input
                id="fileInput"
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleFileChange}
            />
        </NewButton>
    </div>
</div>

        {error && (
          <Typography color="error" className={styles.errorMessage}>
            {error}
          </Typography>
        )}
      </div>
   
  );
};

export default ImportQueryPage;
