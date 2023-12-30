document.addEventListener("DOMContentLoaded", () => {
  displayLinkAnalytics();
});

function displayLinkAnalytics() {
  const linkDetailsContentElement =
    document.getElementById("linkDetailsContent");
  const linkDetailsElement = document.getElementById("linkDetails");

  const linkUsageData = getLinkUsageData();
  const labels = Object.keys(linkUsageData);
  const data = Object.values(linkUsageData).map(
    (usage) => usage.totalTimeSpent
  );
  const counts = Object.values(linkUsageData).map((usage) => usage.count);

  // Sort data based on time spent in descending order
  const sortedData = data.slice().sort((a, b) => b - a);

  // Get the top 15 items for chart
  const top15Data = sortedData.slice(0, 15);

  const ctx = document.getElementById("linkAnalyticsChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.slice(0, 15).map(getHostName),
      datasets: [
        {
          label: "Time Spent (s)",
          data: top15Data.map((time) => time / 1), // convert milliseconds to seconds
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: function (value, context) {
            return counts[context.dataIndex];
          },
        },
      },
    },
  });

  // Display all link details
  linkDetailsContentElement.innerHTML = "";
  labels.forEach((label, index) => {
    const hostName = getHostName(label);
    const opens = counts[index];
    const timeSpent = formatTime(data[index]);

    linkDetailsContentElement.innerHTML += `
            <tr>
                <td>${hostName}</td>
                <td>${opens}</td>
                <td>${timeSpent}</td>
            </tr>`;
  });

  // Button to delete all link usage data
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", () => {
    localStorage.removeItem("linkUsageData");
    linkDetailsContentElement.innerHTML = ""; // Clear the table
    displayLinkAnalytics(); // Refresh the displayed data
  });

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1);
    return `${seconds} sec`;
  }

  function getLinkUsageData() {
    return JSON.parse(localStorage.getItem("linkUsageData")) || {};
  }

  function setLinkUsageData(data) {
    localStorage.setItem("linkUsageData", JSON.stringify(data));
  }

  function getHostName(url) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, ""); // Remove 'www.' if present
    } catch (error) {
      console.error("Error parsing URL:", error);
      return url; // Return the original URL if parsing fails
    }
  }


  // Function to delete a specific link
  window.deleteLink = function (url) {
    const updatedLinkUsageData = getLinkUsageData();
    delete updatedLinkUsageData[url];
    setLinkUsageData(updatedLinkUsageData);

    // Refresh the displayed data
    linkDetailsContentElement.innerHTML = "";
    displayLinkAnalytics();
  };
}
