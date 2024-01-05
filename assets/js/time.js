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
      console.log(`User clicked on link: ${link}`);
    });

    // Extract links as keys from the linkUsageData object
    const links = Object.keys(linkUsageData);

    // Sort links based on count in descending order
    const sortedLinks = links.sort((a, b) => linkUsageData[b].count - linkUsageData[a].count);

    // Take the top 5 links
    const top5Links = sortedLinks.slice(0, 5);

    // Attach click event listeners to the links
    top5Links.forEach(link => {
      const linkElement = document.getElementById(link); // Adjust this based on your HTML structure
      if (linkElement) {
        linkElement.addEventListener('click', () => handleLinkClick(link));
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

function preloadLink(link) {
  // Create a link element with 'prefetch' attribute and append it to the head
  const prefetchLink = document.createElement('link');
  prefetchLink.href = link;
  prefetchLink.rel = 'prefetch';
  document.head.appendChild(prefetchLink);
  console.log(`User clicked on link: ${link}`);
}

function handleLinkClick(link) {
  // Perform any desired action before loading the link, if needed
  console.log(`User clicked on link: ${link}`);
  
  // Preload the link
  preloadLink(link);

  // Now, you can navigate to the link or perform additional actions as needed
  // Example: window.location.href = link;
}

// Call the asynchronous function when needed
loadTopLinks();
