"use client";
import React, { useState, useEffect } from "react";
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

/**
 * Interface that represents a question object.
 *
 * @interface Question
 * @typedef {Object} Question
 * @property {number} id - Unique identifier for the question.
 * @property {string} text - Text of the question.
 */
interface Question{
    id: number;
    text: string;
};

const CACHE_KEY = "fileProcessingCache";

/**
 * Saves the current state of the process to localStorage for caching.
 *
 * @param {Object} state - The state object to cache.
 * @param {Question[]} state.questions - List of questions.
 * @param {"questions"|"import"|"result"} state.currentPage - Current page identifier.
 * @param {number} state.currentQuestionIndex - Index of the currently active question.
 * @param {Record<number, string>} state.selectedAnswers - Map of question IDs to selected answers.
 * @param {string} state.searchQuery - Current search query.
 * @param {string[]} state.keywords - List of extracted keywords.
 */
const saveToLocalStorage = (state: {
  questions : Question[],
  currentPage: "questions" | "import" | "result",
  currentQuestionIndex: number,
  selectedAnswers:Record<number, string>,
  searchQuery:string,
  keywords:string[],
}) => {
  const cacheData = { state, timestamp: new Date().getTime() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

/**
 * Loads the cached state from localStorage.
 *
 * @returns {Object|null} The cached state object or null if no valid cache exists.
 */
const loadFromLocalStorage = () => {
  const cacheData = localStorage.getItem(CACHE_KEY);
  const expirationTime = 24 * 60 * 60 * 1000;
  if (cacheData) {
    const parsedData = JSON.parse(cacheData);
    const currentTime = new Date().getTime();
    if (currentTime - parsedData.timestamp < expirationTime) {
      return parsedData.state;
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }
  return null;
};

/**
 * Description placeholder
 *
 * @returns {*}
 */
const FileProcessingPage: React.FC = () => {

  const cachedState = loadFromLocalStorage();
  const [questions, setQuestions] = useState<Question[]>(cachedState?.questions || []);
  const [currentPage, setCurrentPage] = useState<"import" | "questions" | "result">(cachedState?.currentPage || "import");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(cachedState?.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(cachedState?.selectedAnswers || {});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>(cachedState?.keywords || []);
  const [answers, setAnswers] = useState<{ id: string, answer: string }[]>(cachedState?.answers || []);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        const searchKeywords = searchQuery.trim().split(/\s+/);
        setKeywords(searchKeywords);
      } else if (questions[currentQuestionIndex]) {
        const currentQuestionText = questions[currentQuestionIndex].text;
        const extractedKeywords = extractKeywords(currentQuestionText);
        setKeywords(extractedKeywords);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [searchQuery, currentQuestionIndex, questions]);

  useEffect(() => {
    saveToLocalStorage({
      questions,
      currentPage,
      currentQuestionIndex,
      selectedAnswers,
      searchQuery,
      keywords,
    });
  }, [questions, currentPage, currentQuestionIndex, selectedAnswers, searchQuery,keywords]);

  useEffect(() => {
    const fetchData = async() => {
      if (keywords.length > 0) {
        try {
          setLoading(true);
          const result = await handleGenerateReportSearch(keywords);
          setLoading(false);
          if (result.success) {
            setAnswers(result.data);
          } else {
            console.error("Error:", result.message);
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };
    fetchData();
  }, [keywords]);

  /**
 * Extracts keywords from a given text using NLP techniques.
 * Identifies nouns and adjectives while excluding auxiliary words.
 *
 * @param {string} text - The input text from which to extract keywords.
 * @returns {string[]} An array of keywords extracted from the text.
 */
  const extractKeywords = (text: string): string[] => {
    const doc = nlp(text);
    const keywords = doc
      .match("#Noun+")
      .out("array")
      .concat(doc.match("#Adjective+").out("array"));
    const filteredKeywords = keywords.filter((keyword: string) => {
      const wordDoc = nlp(keyword);
      return !wordDoc.has("#Auxiliary");
    });
    return filteredKeywords;
  };

  /**
 * Handles the file input change event, processes the selected file,
 * and extracts questions from it to update the state.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event triggered when a file is selected.
 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
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
      reader.onerror = () => alert("Error processing file. Please try again.");
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  /**
    * Resets the application state to its initial values by clearing questions, selected answers,
    * keywords, and cached data. Also resets the current page to the import screen.
  */
  const handleClear = () => {
    setQuestions([]);
    setCurrentPage("import");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSearchQuery("");
    setKeywords([]);
    localStorage.removeItem(CACHE_KEY);
  };

  /**
 * Updates the text of a specific question by its ID.
 *
 * @param {number} id - The ID of the question to update.
 * @param {string} updatedText - The new text for the question.
 */
  const handleEditQuestion = (id: number, updatedText: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, text: updatedText } : question
      )
    );
  };

  /**
 * Proceeds to the questions page if there are questions available.
 */
  const handleProceed = () => {
    if (questions.length > 0) setCurrentPage("questions");
  };

  /**
 * Selects an answer for a specific question.
 *
 * @param {number} questionId - The ID of the question to select an answer for.
 * @param {string} answer - The selected answer.
 */
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  /**
    * Navigates to the next or previous question.
    *
    * @param {"next" | "previous"} direction - The direction to navigate ("next" or "previous").
  */
  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentQuestionIndex((prev: number) =>
      direction === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
    setSearchQuery("");
  };

  /**
    * Downloads the questions and selected answers as an Excel file.
 */
  const handleDownload = () => {
    const resultData = questions.map((question) => ({
      question: question.text,
      answer: selectedAnswers[question.id] || "No answer selected",
    }));
    const worksheet = XLSX.utils.json_to_sheet(resultData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Answers");
    XLSX.writeFile(workbook, "questions_and_answers.xlsx");
  };

  /**
    * Renders the header section of the application, displaying contextual information and controls based on the current page.
  */
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
              onClick={() => handleClear()}
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
            onClick={() => handleClear()}
            disabled={questions.length === 0}
          >
            Cancel
          </Button>
        </div>
      )
      }
    </div>
  );

  /**
    * Renders the footer section of the application, providing navigation and action controls based on the current page.
  */
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
            onClick={() => handleClear()}
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

  /**
    * Renders the import page, displaying either an image placeholder if no questions are present or a list of question cards for editing and deletion.
  */
  const renderImportPage = () => (
    <div className={styles.questionsContainer}>
      {questions.length === 0 ? (
        <div className={styles.questionsImage}>
          <img src="/assets/images/import-clipboard.png" alt="clipboard image"/>
        </div>) : (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            text={question.text}
            onDelete={() =>
              setQuestions(questions.filter((q) => q.id !== question.id))
            }
            onEdit={handleEditQuestion}
          />
        ))
      )}
    </div>
  );

  /**
    * Renders the questions page, including progress, the current question, a search bar for answers,
    * and a section to display matching answers or loading state.
  */
  const renderQuestionsPage = () => (
    <>
      <div className={styles.progressContainer}>
        <p>Progress</p>
        <LinearProgress
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.74)",
          }}
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
      <div className={styles.questionSection}>
        {loading ? (
          <div className={styles.questionSectionFiller}>
            <LottieLoader size={"180px"} />
          </div>
        ) : (
          answers.length === 0 ? (
            <div className={styles.questionSectionFiller}>
              <p>No matching answers found in the database </p>
            </div>
          ) : (
            <RadioGroup
              className={styles.answersFormDiv}
              value={selectedAnswers[questions[currentQuestionIndex].id] || ""}
              onChange={(e) =>
                handleAnswerSelect(questions[currentQuestionIndex].id, e.target.value)
              }
            >
              {answers.map((answer) => (
                <FormControlLabel
                  className={styles.answersForm}
                  key={answer.id}
                  value={answer.answer}
                  control={<Radio />}
                  label={answer.answer}
                />
              ))}

            </RadioGroup>
          )
        )}
      </div>
    </>
  );

  /**
    * Renders the results page with a table showing questions and selected answers.
  */
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
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.text}</TableCell>
              <TableCell>{selectedAnswers[question.id] || "No answer selected"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
