document.addEventListener("DOMContentLoaded", () => {
  displayLinkAnalytics();
});

function displayLinkAnalytics() {
  const linkDetailsContentElement =
    document.getElementById("linkDetailsContent");
  const linkDetailsElement = document.getElementById("linkDetails");

  const linkUsageData = getLinkUsageData();
  const labels = Object.keys(linkUsageData);
  const clickCounts = Object.values(linkUsageData).map((usage) => usage.count);

  // Sort data based on click counts in descending order
  const sortedClickCounts = clickCounts.slice().sort((a, b) => b - a);

  // Get the top 15 items for chart
  const top15ClickCounts = sortedClickCounts.slice(0, 15);
  const top15Labels = labels.slice(0, 15);

  const ctx = document.getElementById("linkAnalyticsChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: top15Labels.map(getTitle), // Use getTitle instead of getHostName
      datasets: [
        {
          label: "Click Counts",
          data: top15ClickCounts,
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
            return clickCounts[context.dataIndex] || 0;
          },
        },
      },
    },
  });

  // Display all link details
  linkDetailsContentElement.innerHTML = "";
  top15Labels.forEach((label, index) => {
    const title = getTitle(label); // Use getTitle instead of getHostName
    const clickCount = clickCounts[index] || 0;

    linkDetailsContentElement.innerHTML += `
            <tr>
                <td>${title}</td>
                <td>${clickCount}</td>
            </tr>`;
  });

  // Button to delete all link usage data
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all link usage data?"
    );

    if (confirmation) {
      localStorage.removeItem("linkUsageData");
      linkDetailsContentElement.innerHTML = "";
      displayLinkAnalytics();
    }
  });

  function getLinkUsageData() {
    return JSON.parse(localStorage.getItem("linkUsageData")) || {};
  }

  function setLinkUsageData(data) {
    localStorage.setItem("linkUsageData", JSON.stringify(data));
  }

  function getTitle(url) {
    const linkInfo = linkUsageData[url] || {};
    return linkInfo.title || url; // Return title if available, otherwise return the URL
  }

  window.deleteLink = function (url) {
    const updatedLinkUsageData = getLinkUsageData();
    delete updatedLinkUsageData[url];
    setLinkUsageData(updatedLinkUsageData);

    linkDetailsContentElement.innerHTML = "";
    displayLinkAnalytics();
  };
}
