"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import nlp from "compromise";
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
} from "@mui/material";
import QuestionCard from "@/app/components/question-card/QuestionCard";
import styles from "./fileprocessing.module.css";
import { handleGenerateReportSearch } from "@/app/util/generate-report/generateReportFunctions";
import { LottieLoader } from "@/app/components/lottie-loader/lottieLoader";

interface Question {
  id: number;
  text: string;
  searchQuery?: string;
  keywords?: string[];
  answers?: { id: string; answer: string }[];
}

const CACHE_KEY = "fileProcessingCache";

const saveToLocalStorage = (state: {
  questions: Question[];
  currentPage: "questions" | "import" | "result";
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
}) => {
  const cacheData = { state, timestamp: new Date().getTime() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

const loadFromLocalStorage = () => {
  const cacheData = localStorage.getItem(CACHE_KEY);
  const expirationTime = 24 * 60 * 60 * 1000;
  if (cacheData) {
    const parsedData = JSON.parse(cacheData);
    const currentTime = new Date().getTime();
    if (currentTime - parsedData.timestamp < expirationTime) {
      return parsedData.state;
    }
    localStorage.removeItem(CACHE_KEY);
  }
  return null;
};

const FileProcessingPage: React.FC = () => {
  const cachedState = loadFromLocalStorage();
  const [questions, setQuestions] = useState<Question[]>(cachedState?.questions || []);
  const [currentPage, setCurrentPage] = useState<"import" | "questions" | "result">(
    cachedState?.currentPage || "import"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    cachedState?.currentQuestionIndex || 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    cachedState?.selectedAnswers || {}
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  const extractKeywords = useCallback((text: string): string[] => {
    const doc = nlp(text);
    const keywords = doc
      .match("#Noun+")
      .out("array")
      .concat(doc.match("#Adjective+").out("array"));
    return keywords.filter((keyword: string) => !nlp(keyword).has("#Auxiliary"));
  }, []);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const delayDebounce = setTimeout(() => {
      const searchText = currentQuestion.searchQuery || "";
      const newKeywords = searchText.trim()
        ? searchText.trim().split(/\s+/)
        : extractKeywords(currentQuestion.text);

      if (JSON.stringify(newKeywords) !== JSON.stringify(currentQuestion.keywords)) {
        setQuestions((prev: Question[]) =>
          prev.map(q =>
            q.id === currentQuestion.id ? { ...q, keywords: newKeywords } : q
          )
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentQuestionIndex, questions, extractKeywords]);

  useEffect(() => {
    const abortController = new AbortController();
    const currentQuestion = questions[currentQuestionIndex];
    
    const fetchAnswers = async () => {
      if (!currentQuestion?.keywords?.length) return;

      try {
        setLoading(true);
        const result = await handleGenerateReportSearch(currentQuestion.keywords, {
          signal: abortController.signal
         });

        if (!abortController.signal.aborted) {
          setQuestions((prev: Question[]) =>
            prev.map(q =>
              q.id === currentQuestion.id ? { ...q, answers: result.data } : q
            )
          );
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching answers:", error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAnswers();

    return () => {
      abortController.abort();
    };
  }, [currentQuestionIndex, questions[currentQuestionIndex]?.keywords?.join('|')]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        const processedQuestions: Question[] = jsonData.slice(1).map((row, index) => ({
          id: index + 1,
          text: row[0] || `Question ${index + 1}`,
        }));
        setQuestions(processedQuestions);
      };
      reader.onerror = () => alert("Error processing file");
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClear = () => {
    setQuestions([]);
    setCurrentPage("import");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    localStorage.removeItem(CACHE_KEY);
  };

  const handleEditQuestion = (id: number, text: string) => {
    setQuestions((prev: Question[]) =>
      prev.map(q => q.id === id ? { ...q, text } : q)
    );
  };

  const handleProceed = () => {
    if (questions.length > 0) setCurrentPage("questions");
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentQuestionIndex((prev: number) =>
      direction === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  const handleDownload = () => {
    const data = questions.map(q => ({
      Question: q.text,
      Answer: selectedAnswers[q.id] || "No answer selected"
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "questions_answers.xlsx");
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <Typography variant="h6">File Processing</Typography>
        <Typography variant="body2">
          {currentPage === "import"
            ? "Let's start by importing an Excel file."
            : currentPage === "questions"
              ? "Choose the most appropriate answer."
              : "Let's review the answers before downloading."}
        </Typography>
      </div>
      {currentPage === "import" ? (
        <div className={styles.headerRight}>
          {questions.length === 0 ? (
            <>
              <a href="/assets/templates/File Processing Template.xlsx">Download Template</a>
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
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleClear}
              disabled={questions.length === 0}
            >
              Clear
            </Button>
          )}
        </div>
      ) : currentPage === "questions" && (
        <div className={styles.headerRight}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClear}
            disabled={questions.length === 0}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className={styles.footer}>
      {currentPage === "import" ? (
        <>
          <div></div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProceed}
            disabled={questions.length === 0}
          >
            Proceed
          </Button>
        </>
      ) : currentPage === "questions" ? (
        <>
          <Button
            variant="outlined"
            onClick={() => handleNavigation("previous")}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              currentQuestionIndex === questions.length - 1
                ? setCurrentPage("result")
                : handleNavigation("next")
            }
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClear}
            disabled={questions.length === 0}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
          >
            Download as Excel
          </Button>
        </>
      )}
    </div>
  );

  const renderImportPage = () => (
    <div className={styles.questionsContainer}>
      {questions.length === 0 ? (
        <div className={styles.questionsImage}>
          <img src="/assets/images/import-clipboard.png" alt="clipboard image"/>
        </div>
      ) : (
        questions.map(question => (
          <QuestionCard
            key={question.id}
            id={question.id}
            text={question.text}
            onDelete={() => setQuestions(questions.filter(q => q.id !== question.id))}
            onEdit={handleEditQuestion}
          />
        ))
      )}
    </div>
  );

  const renderQuestionsPage = () => {
    const currentQuestion = questions[currentQuestionIndex] || {};
    const selectedAnswer = selectedAnswers[currentQuestion.id] || "";
    const answersToShow = selectedAnswer 
  ? [{ id: `selected-${currentQuestion.id}`, answer: selectedAnswer }]
  : currentQuestion.answers || [];

    return (
      <>
        <div className={styles.progressContainer}>
          <p>Progress</p>
          <LinearProgress
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.74)" }}
            className={styles.ProgressBar}
            variant="determinate"
            value={((currentQuestionIndex + 1) / questions.length) * 100}
          />
          <p>{currentQuestionIndex + 1}/{questions.length}</p>
        </div>
        <div className={styles.question}>
          <p>{currentQuestion.text}</p>
        </div>
        <div className={styles.searchBar}>
          <p>Not found the answer you are looking for?</p>
          <input
            type="text"
            className={styles.searchArea}
            placeholder="Search here..."
            value={currentQuestion.searchQuery || ""}
            onChange={(e) => setQuestions((prev: Question[]) =>
              prev.map((q, idx) =>
                idx === currentQuestionIndex ? { ...q, searchQuery: e.target.value } : q
              )
            )}
          />
        </div>
        <div className={styles.questionSection}>
          {loading ? (
            <div className={styles.questionSectionFiller}>
              <LottieLoader size="180px" state="loading" />
            </div>
          ) : answersToShow.length === 0 ? (
            <div className={styles.questionSectionFiller}>
              <p>No matching answers found in the database</p>
            </div>
          ) : (
            <RadioGroup
              className={styles.answersFormDiv}
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
            >
              {answersToShow.map((answer) => (
                <FormControlLabel
                  key={`${currentQuestion.id}-${answer.id}`}
                  className={styles.answersForm}
                  value={answer.answer}
                  control={<Radio />}
                  label={answer.answer}
                />
              ))}
            </RadioGroup>
          )}
        </div>
      </>
    );
  };

  const renderResultPage = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Selected Answer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map(question => (
            <TableRow key={question.id}>
              <TableCell>{question.text}</TableCell>
              <TableCell>{selectedAnswers[question.id] || "No answer selected"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  useEffect(() => {
    saveToLocalStorage({
      questions,
      currentPage,
      currentQuestionIndex,
      selectedAnswers,
    });
  }, [questions, currentPage, currentQuestionIndex, selectedAnswers]);

  return (
    <div className={styles.fileProcessingPage}>
      {renderHeader()}
      <div className={styles.middleBody}>
        {currentPage === "import"
          ? renderImportPage()
          : currentPage === "questions"
            ? renderQuestionsPage()
            : renderResultPage()}
      </div>
      {renderFooter()}
    </div>
  );
};

export default FileProcessingPage;