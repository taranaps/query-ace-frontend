"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Typography, Button, LinearProgress, FormControlLabel, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import QuestionCard from "@/app/components/question-card/QuestionCard";
import styles from "./fileprocessing.module.css";

interface Question {
  id: number;
  text: string;
}

const FileProcessingPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState<"import" | "questions" | "result">("import");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const dummyAnswers = [
    "Corporate culture refers to the shared values, beliefs, and practices that define an organization.",
    "Corporate strategy involves long-term planning to achieve goals through resource allocation, market positioning, and growth.",
    "Corporate governance is the system of rules by which a company is directed and controlled, ensuring accountability and transparency.",
    "Corporate social responsibility (CSR) reflects a company’s commitment to ethical behavior and contributing to societal welfare.",
    "Leadership in a corporation is responsible for setting the vision, creating strategies, and motivating employees to achieve company goals.",
    "Corporate finance manages a company’s financial activities, including investments, capital structure, and risk management.",
    "Corporate brand is the identity and reputation of a company, shaped by its products, services, and customer experiences.",
    "Key performance indicators (KPIs) are measurable values used to track how well a company is achieving its business objectives.",
    "Corporate merger or acquisition is the process where companies combine or one company buys another to expand market share or improve efficiencies.",
    "Corporate ethics refers to the principles that guide a company’s behavior, ensuring decisions are made in a morally sound way."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

        const processedQuestions: Question[] = jsonData.slice(1).map((row, index) => ({
          id: index + 1,
          text: row[0] || `Question ${index + 1}`,
        }));

        setQuestions(processedQuestions);
      };

      reader.onerror = () => alert("Error processing file. Please try again.");
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleProceed = () => {
    if (questions.length > 0) setCurrentPage("questions");
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setCurrentPage("result");
  };

  const handleDownload = () => {
    const resultData = questions.map((question) => ({
      Question: question.text,
      Answer: selectedAnswers[question.id] || "No answer selected",
    }));

    const worksheet = XLSX.utils.json_to_sheet(resultData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Answers");

    // Download the Excel file
    XLSX.writeFile(workbook, "questions_and_answers.xlsx");
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <Box className={styles.fileProcessingPage}>
      {currentPage === "import" ? (
        <>
          {/* Header Section */}
          <Box className={styles.header}>
            <Typography variant="h5" fontWeight="bold">
              Import Excel Questions
            </Typography>
            <label htmlFor="fileInput">
              <Button variant="contained" component="span">
                Import File
              </Button>
              <input
                id="fileInput"
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </label>
          </Box>

          {/* Questions List */}
          <Box className={styles.questionsContainer}>
            {questions.length === 0 ? (
              <Typography className={styles.noAnswer} variant="body1" textAlign="center" color="textSecondary">
                No questions imported yet. Upload an Excel file to proceed.
              </Typography>
            ) : (
              questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  id={question.id}
                  text={question.text}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  onEdit={() => {}}
                />
              ))
            )}
          </Box>

          {/* Footer */}
          <Box className={styles.footer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProceed}
              disabled={questions.length === 0}
            >
              Proceed
            </Button>
          </Box>
        </>
      ) : currentPage === "questions" ? (
        <>
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / questions.length) * 100}
            />
          </div>

          {/* Question Section */}
          <Box className={styles.questionSection}>
            <Typography variant="h5" fontWeight="bold" marginBottom="16px">
              {questions[currentQuestionIndex]?.text}
            </Typography>

            {/* Answers Section */}
            <RadioGroup className={styles.answersFormDiv}
              value={selectedAnswers[questions[currentQuestionIndex].id] || ""}
              onChange={(e) =>
                handleAnswerSelect(questions[currentQuestionIndex].id, e.target.value)
              }
            >
              {dummyAnswers.map((answer, index) => (
                <FormControlLabel className={styles.answersForm}
                  key={index}
                  value={answer}
                  control={<Radio />}
                  label={answer}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Navigation Buttons */}
          <Box className={styles.footer}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={currentQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </>
      ) : (
        <>
          {/* Display Selected Answers in Table Format */}
          <Box className={styles.resultContainer}>
            <Typography variant="h5" fontWeight="bold" marginBottom="16px">
              Final Answers
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Selected Answer</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.text}</TableCell>
                      <TableCell>
                        {selectedAnswers[question.id] || "No answer selected"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Download Button */}
          <Box className={styles.footer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download as Excel
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FileProcessingPage;
