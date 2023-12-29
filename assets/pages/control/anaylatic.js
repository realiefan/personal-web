
       document.addEventListener("DOMContentLoaded", () => {
            displayLinkAnalytics();
        });

        function displayLinkAnalytics() {
            const linkUsageData = getLinkUsageData();
            const labels = Object.keys(linkUsageData);
            const data = Object.values(linkUsageData).map((usage) => usage.totalTimeSpent);
            const counts = Object.values(linkUsageData).map((usage) => usage.count);

            // Sort data based on time spent in descending order
            const sortedData = data.slice().sort((a, b) => b - a);

            // Get the top 10 items
            const top10Data = sortedData.slice(0, 10);

            // Get the corresponding labels and counts
            const top10Labels = top10Data.map((timeSpent) => labels[data.indexOf(timeSpent)]);
            const top10Counts = top10Data.map((timeSpent) => counts[data.indexOf(timeSpent)]);

            const ctx = document.getElementById("linkAnalyticsChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: top10Labels.map(getHostName),
                    datasets: [
                        {
                            label: "Time Spent (s)",
                            data: top10Data.map((time) => time / 1000), // convert milliseconds to seconds
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
                                return top10Counts[context.dataIndex];
                            },
                        },
                    },
                },
            });

            // Display link details
            const linkDetailsElement = document.getElementById("linkDetails");
            top10Labels.forEach((label, index) => {
                linkDetailsElement.innerHTML += `<strong>${getHostName(label)}</strong>: 
    Opens - ${top10Counts[index]}, 
    Time Spent - ${formatTime(top10Data[index])} <br>`;
            });
        }

        function formatTime(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000);
            return `${seconds} sec`;
        }

        function getLinkUsageData() {
            return JSON.parse(localStorage.getItem("linkUsageData")) || {};
        }

        function getHostName(url) {
                const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^.\/]+)(?:\.[^.\/]+)*(?:\/|$)/);
                return match ? match[1] : url;
            }
