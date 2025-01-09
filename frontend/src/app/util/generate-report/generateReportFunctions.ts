export const handleGenerateReportSearch = async (searchData: string[]) => {
    try {
        const requestBody = searchData;

        const response = await fetch(`/api/generatereport/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Report generated successfully:", responseData);
            return { success: true, data: responseData };
        }

        console.error(`Failed to generate report. Status: ${response.status}`);
        const errorData = await response.json();
        return { success: false, message: errorData.message || `Failed to generate report. Status: ${response.status}` };
    } catch (error) {
        console.error("An error occurred while generating the report:", error);
        return { success: false, message: "An error occurred while generating the report." };
    }
};
