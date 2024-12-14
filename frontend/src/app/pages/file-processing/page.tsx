
"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import DataCard from "@/app/components/lookup-datacard/DataCard";
import Pagination from "@/app/components/pagination/Pagination";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Dummy questions for development purposes
const dummyQuestions = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  text: `Question ${index + 1}: This is a sample question about Experion Technologies, From where Experion got these high talented people in ILP batch 05 .`,
  createdAt: "11/11/2024",
}));

const FileProcessingPage: React.FC = () => {
  const [questions, setQuestions] = useState(dummyQuestions); // Use dummy data for now
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false); // Toggle between Import Page and Questions Page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 questions per page

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    console.log(`Deleted Question ${id}`);
  };

  const handleEdit = (id: number) => {
    const newText = prompt(
      "Edit the question:",
      questions.find((q) => q.id === id)?.text
    );
    if (newText) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, text: newText } : q))
      );
      console.log(`Edited Question ${id}`);
    }
  };

  const handleProceed = () => {
    if (!isQuestionsVisible) {
      setIsQuestionsVisible(true); // Transition to the Questions List Page
    } else {
      const confirmSave = window.confirm(
        "Questions will be saved, click OK!"
      );
      if (confirmSave) {
        setIsQuestionsVisible(false); // Go back to the Import File Page
        setQuestions(dummyQuestions); // Reset questions to the dummy data
        setCurrentPage(1); // Reset pagination to the first page
      }
    }
  };

  const handleDiscard = () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all changes and go back?"
    );
    if (confirmDiscard) {
      setIsQuestionsVisible(false); // Go back to Import File Page
      setQuestions(dummyQuestions); // Reset questions to initial dummy data
      setCurrentPage(1); // Reset pagination to the first page
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      {!isQuestionsVisible ? (
        <>
          {/* Import File Page */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              backgroundColor: "#ffffff",
            }}
          >
            {/* This section shows the header and the "Import File" button. */}
            <DataCard
              id={1}
              title="File Processing"
              details="Let's start by importing an Excel file"
              scrollable={false}
              buttonAlignment="right"
              buttonPosition="same-row"
              disableBoxShadow={true}
              buttons={[
                {
                  label: "Import File",
                  onClick: () => console.log("Import File button clicked"),
                  color: "primary",
                  startIcon: <CloudUploadIcon />,
                },
              ]}
              sx={{
                marginBottom: "1.5rem",
                padding: "2rem",
                borderRadius: 0,
                backgroundColor: "#FFFFFF",
              }}
            />

            {/* This section shows an illustration and a message prompting the user to import a file. */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ marginBottom: "1rem" }}
                >
                  Import File to Get a Preview
                </Typography>
                <Image
                  src="/images.png"
                  alt="File Processing Illustration"
                  width={300}
                  height={300}
                />
              </Box>
            </Box>

            {/* This section has a "Proceed" button to transition to the Questions List Page. */}
            <DataCard
              id={2}
              title=""
              details={
                <>
                  Having trouble with importing Excel?{" "}
                  <a
                    href="#"
                    style={{ color: "#007BFF", textDecoration: "none" }}
                  >
                    Download template
                  </a>
                </>
              }
              scrollable={false}
              buttonAlignment="right"
              buttonPosition="same-row"
              disableBoxShadow={true}
              buttons={[
                {
                  label: "Proceed",
                  onClick: handleProceed,
                  color: "primary",
                  endIcon: <ArrowForwardIcon />,
                },
              ]}
              sx={{
                marginTop: "1.5rem",
                padding: "2rem",
                borderRadius: 0,
                backgroundColor: "#FFFFFF",
              }}
            />
          </Box>
        </>
      ) : (
        <>
          {/* Questions List Page */}
          <Box
            sx={{
              padding: "1.5rem",
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #EEEEEE",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Header Title */}
            <Typography variant="h5" fontWeight="bold">
              Review Questions
            </Typography>

            {/* Discard Button */}
            <Button
              variant="outlined"
              sx={{
                color: "#FF0000",
                borderColor: "#FF0000",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  borderColor: "#FF0000",
                },
              }}
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </Box>

          {/* This section displays the list of questions with pagination. */}
          <Box
            sx={{
              flex: 1,
              padding: "1.5rem",
              overflowY: "scroll",
              backgroundColor: "#ffffff",
            }}
          >
            {questions.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            ).map((question) => (
              <DataCard
                key={question.id}
                id={question.id}
                title={question.text}
                details={`Created at: ${question.createdAt}`}
                buttons={[
                  {
                    label: "Edit",
                    onClick: () => handleEdit(question.id),
                    color: "primary",
                  },
                  {
                    label: "Delete",
                    onClick: () => handleDelete(question.id),
                    color: "error",
                  },
                ]}
                sx={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "#F9F9F9",
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>

          {/* Footer Section with Swapped Pagination and Page Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderTop: "1px solid #EEEEEE",
              position: "sticky",
              bottom: 0,
              backgroundColor: "#ffffff",
              zIndex: 10,
            }}
          >
            {/* Pagination Info */}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            <Typography variant="body2" color="text.secondary">
              {`Showing page ${currentPage} out of ${totalPages} | Total questions ${questions.length}`}
            </Typography>

            {/* Proceed Button */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleProceed}
            >
              Proceed
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FileProcessingPage;

