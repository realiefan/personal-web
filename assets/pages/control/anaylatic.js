document.addEventListener("DOMContentLoaded", () => {
  displayLinkAnalytics();
});

function displayLinkAnalytics() {
  const linkDetailsContentElement =
    document.getElementById("linkDetailsContent");
  const linkAnalyticsChartElement =
    document.getElementById("linkAnalyticsChart");

  const linkUsageData = getLinkUsageData();
  const labels = Object.keys(linkUsageData);
  const clickCounts = Object.values(linkUsageData).map((usage) => usage.count);

  // Sort data based on click counts in descending order
  const sortedData = labels
    .map((label, index) => ({ label, clickCount: clickCounts[index] }))
    .sort((a, b) => b.clickCount - a.clickCount);

  // Get the top 15 items for the chart
  const top15Data = sortedData.slice(0, 15);

  const chartData = {
    labels: top15Data.map((item) => getTitle(item.label)),
    datasets: [
      {
        label: "Click Counts",
        data: top15Data.map((item) => item.clickCount),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const ctx = linkAnalyticsChartElement.getContext("2d");
  new Chart(ctx, {
    type: "bar", // Change the chart type to "bar"
    data: chartData,
    options: chartOptions,
  });

  // Set up the delete button
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all link usage data?"
    );

    if (confirmation) {
      // Clear link usage data from localStorage
      localStorage.removeItem("linkUsageData");

      // Clear link details content and refresh analytics
      linkDetailsContentElement.innerHTML = "";
      displayLinkAnalytics();
    }
  });

  // Helper functions
  function getLinkUsageData() {
    return JSON.parse(localStorage.getItem("linkUsageData")) || {};
  }

  function getTitle(url) {
    const linkInfo = linkUsageData[url] || {};
    return linkInfo.title || url;
  }

  window.deleteLink = function (url) {
    const updatedLinkUsageData = getLinkUsageData();
    delete updatedLinkUsageData[url];
    setLinkUsageData(updatedLinkUsageData);

    linkDetailsContentElement.innerHTML = "";
    displayLinkAnalytics();
  };

  function setLinkUsageData(data) {
    localStorage.setItem("linkUsageData", JSON.stringify(data));
  }
}
