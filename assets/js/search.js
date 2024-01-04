function performSearch() {
  var searchEngine = document.getElementById("searchEngineDropdown").value;
  var searchTerm = document.getElementById("googleSearch").value;

  // Add your logic to perform the search based on the selected search engine and searchTerm
  if (searchEngine === "google") {
    window.location.href =
      "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  } else if (searchEngine === "duckduckgo") {
    window.location.href =
      "https://duckduckgo.com/?q=" + encodeURIComponent(searchTerm);
  } else if (searchEngine === "reddit") {
    window.location.href =
      "https://www.reddit.com/search?q=" + encodeURIComponent(searchTerm);
  } else if (searchEngine === "twitter") {
    window.location.href =
      "https://twitter.com/search?q=" + encodeURIComponent(searchTerm);
  } else if (searchEngine === "youtube") {
    window.location.href =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(searchTerm);
  } else if (searchEngine === "nostr") {
    window.location.href =
      "https://nostr.band/?q=" + encodeURIComponent(searchTerm);
  }
  // Add more conditions for other search engines
}

document
  .getElementById("googleSearch")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });
