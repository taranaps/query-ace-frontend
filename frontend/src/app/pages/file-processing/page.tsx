"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
    Typography,
    Button,
    LinearProgress,
    FormControlLabel,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
} from "@mui/material";
import QuestionCard from "@/app/components/question-card/QuestionCard";
import styles from "./fileprocessing.module.css";
import CustomButton from "@/app/components/custom-button/CustomButton";

interface Question {
    id: number;
    text: string;
}

const FileProcessingPage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState<"import" | "questions" | "result">("import");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

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
        "Corporate ethics refers to the principles that guide a company’s behavior, ensuring decisions are made in a morally sound way.",
    ];

    const filteredAnswers = searchQuery
        ? dummyAnswers.filter((answer) =>
            answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : dummyAnswers;

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
        <div className={styles.fileProcessingPage}>
            {currentPage === "import" ? (
                <>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <h6>
                                File Processing
                            </h6>
                            {questions.length === 0 ? (
                                <p>Let's start by importing an excel file</p>

                            ) : (
                                <p>Let’s review the questions. You can make any changes as you may please</p>
                            )}
                        </div>
                        <div className={styles.headerRight}>
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
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className={styles.middleBody}>
                        <div className={styles.questionsContainer}>
                            {questions.length === 0 ? (
                                <div className={styles.questionsImage}>
                                    <img src="/assets/images/import-clipboard.png" />
                                </div>
                            ) : (
                                questions.map((question) => (
                                    <QuestionCard
                                        key={question.id}
                                        id={question.id}
                                        text={question.text}
                                        onDelete={() => handleDeleteQuestion(question.id)}
                                        onEdit={() => { }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.footerLeft}>
                            <p>Having trouble with importing excel ?</p>
                            <a>Download Template</a>
                        </div>

                        <div className={styles.footerRight}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleProceed}
                                disabled={questions.length === 0}
                            >
                                Proceed
                            </Button>
                        </div>
                    </div>
                </>
            ) : currentPage === "questions" ? (
                <div className={styles.questionsContainer}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <h6>
                                File Processing
                            </h6>
                            <p>Choose the one that is most apted.</p>
                        </div>

                    </div>
                    <div className={styles.progressContainer}>
                        <p>Progress</p>
                        <LinearProgress
                            className={styles.ProgressBar}
                            variant="determinate"
                            value={((currentQuestionIndex + 1) / questions.length) * 100}
                        />
                        <p>
                            {currentQuestionIndex + 1}/{questions.length}
                        </p>
                    </div>
                    <div className={styles.question}>
                        <p>
                            {questions[currentQuestionIndex]?.text}
                        </p>
                    </div>
                    {/* Search Box */}
                    <div className={styles.searchBar}>
                        <p>Not found the answer you are looking for ?</p>
                        <input
                            type="text"
                            className={styles.searchArea}
                            placeholder="Search here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Question Section */}
                    <div className={styles.questionSection}>


                        {/* Answers Section */}
                        <RadioGroup
                            className={styles.answersFormDiv}
                            value={selectedAnswers[questions[currentQuestionIndex].id] || ""}
                            onChange={(e) =>
                                handleAnswerSelect(questions[currentQuestionIndex].id, e.target.value)
                            }
                        >
                            {filteredAnswers.map((answer, index) => (
                                <FormControlLabel
                                    className={styles.answersForm}
                                    key={index}
                                    value={answer}
                                    control={<Radio />}
                                    label={answer}
                                />
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Navigation Buttons */}
                    <div className={styles.footer}>
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
                    </div>
                </div>
            ) : (
                <>
                    {/* Display Selected Answers in Table Format */}
                    <div className={styles.questionsContainer}>
                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <h6>
                                    Final Answers
                                </h6>
                                <p>Let's review the answers before downloading</p>
                            </div>
                            <div className={styles.headerRight}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDownload}
                                >
                                    Download as Excel
                                </Button>

                            </div>
                        </div>

                        <TableContainer
                            component={Paper}
                            className={styles.customTableContainer}
                        >
                            <Table className={styles.customTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Question</strong></TableCell>
                                        <TableCell><strong>Selected Answer</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questions.map((question) => (
                                        <TableRow className={styles.customTableRow} key={question.id}>
                                            <TableCell>
                                                <p>{question.text}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{selectedAnswers[question.id] || "No answer selected"}</p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                </>
            )
            }
        </div >
    );
};

export default FileProcessingPage;
