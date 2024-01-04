async function loadTopLinks() {
  try {
    // Retrieve data from local storage asynchronously
    const linkUsageData = await new Promise((resolve, reject) => {
      const data = localStorage.getItem('linkUsageData');
      if (data) {
        resolve(JSON.parse(data));
      } else {
        reject(new Error('No link usage data found in local storage.'));
      }
    });

    // Extract links as keys from the linkUsageData object
    const links = Object.keys(linkUsageData);

    // Sort links based on count in descending order
    const sortedLinks = links.sort((a, b) => linkUsageData[b].count - linkUsageData[a].count);

    // Take the top 5 links
    const top5Links = sortedLinks.slice(0, 5);

    // Dynamically load the links or perform any other desired action
    top5Links.forEach(link => {
      // Example: Open links in a new tab
      console.log(`Loading link: ${link}`);
      window.open(link, '_blank');
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Call the asynchronous function when needed
loadTopLinks();
