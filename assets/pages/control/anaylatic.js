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
  const performances = Object.values(linkUsageData).map(
    (usage) => usage.performance
  );

  // Sort data based on click counts in descending order
  const sortedData = labels
    .map((label, index) => ({
      label,
      clickCount: clickCounts[index],
      performance: performances[index],
    }))
    .sort((a, b) => b.clickCount - a.clickCount);

  // Get the top 15 items for the chart
  const top15Data = sortedData.slice(0, 10);

  const chartData = {
    labels: top15Data.map((item) => getTitle(item.label)),
    datasets: [
      {
        label: "Click Counts",
        data: top15Data.map((item) => item.clickCount),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "primaryY",
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
      primaryY: {
        type: "linear",
        position: "left",
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "false",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            const url = sortedData[context.dataIndex].label;

            const linkInfo = linkUsageData[url] || {};
            const performance = linkInfo.performance
              ? Math.round(linkInfo.performance) + " ms"
              : "N/A";

            // Format lastAccessTime to show only the date
            const lastAccessTime = linkInfo.lastAccessTime
              ? new Date(linkInfo.lastAccessTime).toLocaleDateString()
              : "N/A";

            return [
              `${label}: ${value} clicks`,
              `Time to load: ${performance}`,
              `Last Access: ${lastAccessTime}`,
            ];
          },
        },
      },
    },
  };

  const ctx = linkAnalyticsChartElement.getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
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
