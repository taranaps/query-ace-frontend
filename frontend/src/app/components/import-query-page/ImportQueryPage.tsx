"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Typography } from "@mui/material";
import styles from "./ImportQueryPage.module.css";
import DataCardImport from "../import-datacard/DataCardImport";
import QueryTagInterface from "@/app/interface/query/queryTagInterface";
import { handleAddNewBulkQueryAndAnswer } from "@/app/util/query/queryFunctionalities";
import { useAuth } from "@/context/AuthContext";
import NewButton from "../new-button/NewButton";
import DataPopupImport from "../data-popup-import/DataPopupImport";
import { v4 as uuidv4 } from "uuid";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

/**
 * Interface for processed question data.
 *
 * @interface ProcessedDataType
 * @typedef {Object} ProcessedDataType
 * @property {string} id - Unique identifier for the question.
 * @property {string} question - The question text.
 * @property {number} userId - The user ID of the question author.
 * @property {QueryTagInterface[]} tags - The tags associated with the question.
 * @property {Array<{ answer: string; userId: number }>} answers - The list of answers to the question.
 * @description Interface for processed question data.
 */
interface ProcessedDataType {
  id: string;
  question: string;
  userId: number;
  tags: QueryTagInterface[];
  answers: { answer: string; userId: number }[];
}

const CACHE_KEY = "processedQuestions";
const CACHE_TIMESTAMP_KEY = "cacheTimestamp";

/**
 * Page component for importing queries from an Excel file.
 * Allows users to upload an Excel file, process the data, and save it to the database.
 * Displays a preview of the imported data and provides options to edit, clear and save the imported data.
 *
 * @returns {JSX.Element} The ImportQueryPage component.
 */
const ImportQueryPage = () => {

  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<ProcessedDataType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardData, setSelectedCardData] = useState<ProcessedDataType | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openImportPopup, setOpenImportPopup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnimationState, setLoadingAnimationState] = useState("loading");

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

  /**
   * Function to validate the uploaded file.
   * Checks if the file is not null and is of the correct format (.xlsx).
   * Displays an error message if the file format is invalid.
   * Returns true if the file is valid, false otherwise.
   *
   * @param {(File | null)} file - The uploaded file object.
   * @returns {boolean} True if the file is valid, false otherwise.
   */
  const validateFile = (file: File | null): boolean => {
    if (!file) {
      setError("No file selected. Please choose a file to import.");
      return false;
    }

    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setError("Invalid file format. Please select an Excel file (.xlsx).");
      return false;
    }

    return true;
  };

  /**
   * Function to handle file change event.
   * Reads the uploaded file, processes the data, and updates the state.
   * Displays an error message if the file format is invalid.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file change event.
   * @returns {void} Updates the state with the processed data.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingAnimationState("loading");
    setIsLoading(true);
    setOpenImportPopup(false);
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (!validateFile(selectedFile)){
      setIsLoading(false);
      return;
    }

    if (selectedFile) {

      const reader = new FileReader();
      reader.onload = (event) => {

        const result = event.target?.result as ArrayBuffer;
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const mergedCells = worksheet["!merges"] || [];
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
          row.some((cell) => cell !== undefined && String(cell).trim() !== "")
        );

        const rows: (string | number)[][] = nonEmptyRows;
        const headerRow = rows[0];
        const expectedColumns = ["Question", "Response", "Category", "Company"];

        if (
          headerRow[0] !== expectedColumns[0] ||
          headerRow[1] !== expectedColumns[1] ||
          headerRow[2] !== expectedColumns[2] ||
          headerRow[3] !== expectedColumns[3]
        ) {
          setError("Invalid file format. Please Use the Template provided.");
          setIsLoading(false);
          return;
        }

        const processedData: ProcessedDataType[] = [];
        let lastCategory = "";
        let lastCompany = "";

        rows.slice(1).forEach((row) => {
          const question = row[0] ? String(row[0]) : null;
          const answer = row[1] ? String(row[1]) : "No Response";

          if (row[2]) {
            lastCategory = String(row[2]);
          }
          if (row[3]) {
            lastCompany = String(row[3]);
          }
          if (question) {
            if (!user) {
              throw new Error("User must be authenticated to perform this action");
            }
            const tags: QueryTagInterface[] = [];
            if (lastCategory) {
              tags.push({ tagGroupName: "Category", tagName: lastCategory });
            }
            if (lastCompany) {
              tags.push({ tagGroupName: "Company", tagName: lastCompany });
            }
            const existingQuestion = processedData.find((data) => data.question === question);
            if (existingQuestion) {
              existingQuestion.answers.push({
                answer, userId: user.id
              });
            } else {
              processedData.push({
                id: uuidv4(),
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
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
        setError("Failed to read the file. Please try again.");
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  /**
   * Function to clear the imported file data and reset the state.
   * Clears the file, questions, and error state.
   * Removes the cached data from local storage.
   */
  const handleClear = () => {
    setFile(null);
    setQuestions([]);
    setError(null);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  };

  /**
   * Function to save the imported data to the database.
   *
   * @async
   * @returns {Promise<void>} A Promise that resolves after the save operation is completed.
   */
  const handleSave = async() => {
    setLoadingAnimationState("loading");
    setIsLoading(true);

    try {
      const saved = await handleAddNewBulkQueryAndAnswer(questions);
      if (saved) {
        setLoadingAnimationState("success");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        handleClear();
        setIsLoading(false);
      } else {
        setLoadingAnimationState("failed");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
      }
    } catch (error) {
      setLoadingAnimationState("failed");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      console.error("An error occurred during the save process:", error);
    }
  };

  /**
   * Function to handle card click event.
   * Sets the selected card data and opens the popup.
   *
   * @param {ProcessedDataType} data - The data of the selected card.
   * @returns {void} Sets the state and opens the popup.
   */
  const handleCardClick = (data: ProcessedDataType) => {
    setSelectedCardData(data);
    setOpenPopup(true);
  };

  /**
   * Function to handle saving the updated data from the popup.
   * Updates the question data and closes the popup.
   *
   * @param {ProcessedDataType} updatedData - The updated data from the popup.
   * @returns {void} Updates the state and closes the popup.
   */
  const handlePopupSave = (updatedData: ProcessedDataType) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === updatedData.id ? { ...question, ...updatedData } : question
      )
    );
    setOpenPopup(false);
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LottieLoader size={"240px"} state={loadingAnimationState} />
      ) : (
        <>
          <div className={styles.dataCardsContainer}>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <DataCardImport
                  key={index}
                  id={index + 1}
                  question={question.question}
                  answers={question.answers}
                  tags={question.tags}
                  onDelete={() =>
                    setQuestions((prev) => prev.filter((data, i) => i !== index))
                  }
                  onClick={() => handleCardClick(question)}
                />
              ))
            ) : error ? (
              <Typography color="error" className={styles.errorMessage}>
                {error}
              </Typography>
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
            <div className={styles.rightButtons}>
              {questions.length > 0 && (
                <NewButton
                  variant="cancel"
                  onClick={handleClear}
                  disabled={!file && questions.length === 0}
                  width="fit"
                  type="button"
                >
              Clear
                </NewButton>
              )}
              <NewButton
                variant={questions.length > 0 ? "submit" : "info"}
                onClick={() =>
                  questions.length > 0
                    ? handleSave()
                    : setOpenImportPopup(true)
                }
                width="fit"
                type="button"
              >
                {questions.length > 0 ? "Save Data" : "Import File"}
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
          {openPopup && (
            <DataPopupImport
              data={selectedCardData}
              onClose={() => setOpenPopup(false)}
              onSave={handlePopupSave}
            />
          )}
          {openImportPopup && (
            <Dialog open={openImportPopup} onClose={() => setOpenImportPopup(false)}>
              <DialogTitle>Bulk Upload Queries</DialogTitle>
              <DialogContent>
                <p>
              Download the{" "}
                  <a
                    href="/assets/templates/Import Query Template.xlsx"
                    style={{ color: "#2196f3" }}
                  >
                template
                  </a>
              , enter your queries with corresponding data, and upload it below:
                </p>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <label
                    htmlFor="fileInput"
                    style={{ display: "block", fontSize: "14px", color: "#555" }}
                  >
                Click here to upload a file
                  </label>
                  <input
                    hidden={true}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    style={{ marginTop: "8px", width: "100%" }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default ImportQueryPage;
