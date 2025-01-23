export const handleAddNewTag = async(
  tag: {
        tagGroupName: string, tagNames: string
    }
) => {

  try {
    const requestBody =  tag ;
    const response = await fetch("/api/queries/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Tags successfully added to the query.");
      return true;
    }

    console.error(`Failed to add tags. Status: ${response.status}`);
    return false;
  } catch (error) {
    console.error("An error occurred while adding tags:", error);
    return false;
  }

};

export const handleAddNewTagToExistingQuery = async(
  id: string,
  tags: { tagGroupName: string; tagName: string }
) => {
  try {
    const requestBody =  tags;
    const response = await fetch(`/api/queries/${id}/tags/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Tags successfully added to the query.");
      return { success: true, message: "Tags successfully added to the query." };
    }

    console.error(`Failed to add tags. Status: ${response.status}`);
    return { success: false, message: `Failed to add tags. Status: ${response.status}` };
  } catch (error) {
    console.error("An error occurred while adding tags:", error);
    return { success: false, message: "An error occurred while adding tags." };
  }
};
