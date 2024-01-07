function mergeEmbedsDataToLinks() {
    try {
      const embedsData = localStorage.getItem("embedsData");
      console.log(embedsData); // Log to verify data
  
      if (embedsData) {
        const embedsDataArray = JSON.parse(embedsData);
  
        const links = JSON.parse(localStorage.getItem("links") || "[]");
  
        embedsDataArray.forEach((embedItem) => {
          const existingIndex = links.findIndex(
            (link) => link.url === embedItem.url
          );
  
          if (existingIndex === -1) {
            links.push(embedItem);
          }
        });
  
        localStorage.setItem("links", JSON.stringify(links));
      }
    } catch (error) {
      console.error("Error merging embed data:", error);
    }
  }
  
  // Call the function to execute the merging
  mergeEmbedsDataToLinks();
  