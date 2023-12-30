function performGoogleSearch(searchTerm) {
  var url = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState(
    { searchEngine: "google", searchTerm: searchTerm },
    "",
    url
  );
}

function performDuckDuckGoSearch(searchTerm) {
  var url = "https://duckduckgo.com/?q=" + encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState(
    { searchEngine: "duckduckgo", searchTerm: searchTerm },
    "",
    url
  );
}

function performRedditSearch(searchTerm) {
  var url = "https://www.reddit.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState(
    { searchEngine: "reddit", searchTerm: searchTerm },
    "",
    url
  );
}

function performTwitterSearch(searchTerm) {
  var url = "https://twitter.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState(
    { searchEngine: "twitter", searchTerm: searchTerm },
    "",
    url
  );
}

function performYouTubeSearch(searchTerm) {
  var url =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState(
    { searchEngine: "youtube", searchTerm: searchTerm },
    "",
    url
  );
}

function performNostrSearch(searchTerm) {
  var url = "https://nostr.band/?q=" + encodeURIComponent(searchTerm);
  window.open(url, "_self");
  history.pushState({ searchEngine: "nostr", searchTerm: searchTerm }, "", url);
}

// Add more search functions for other search engines

function performSearch() {
  var searchEngine = document.getElementById("searchEngineDropdown").value;
  var searchTerm = document.getElementById("googleSearch").value;

  // Call the appropriate search function based on the selected search engine
  switch (searchEngine) {
    case "google":
      performGoogleSearch(searchTerm);
      break;
    case "duckduckgo":
      performDuckDuckGoSearch(searchTerm);
      break;
    case "reddit":
      performRedditSearch(searchTerm);
      break;
    case "twitter":
      performTwitterSearch(searchTerm);
      break;
    case "youtube":
      performYouTubeSearch(searchTerm);
      break;
    case "nostr":
      performNostrSearch(searchTerm);
      break;
    // Add more cases for other search engines
    default:
      console.log("Unsupported search engine");
  }
}

document
  .getElementById("googleSearch")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

// Listen for the onpopstate event to handle changes in the browser history
window.onpopstate = function (event) {
  if (event.state) {
    var { searchEngine, searchTerm } = event.state;
    // Call the appropriate search function based on the state
    switch (searchEngine) {
      case "google":
        performGoogleSearch(searchTerm);
        break;
      case "duckduckgo":
        performDuckDuckGoSearch(searchTerm);
        break;
      case "reddit":
        performRedditSearch(searchTerm);
        break;
      case "twitter":
        performTwitterSearch(searchTerm);
        break;
      case "youtube":
        performYouTubeSearch(searchTerm);
        break;
      case "nostr":
        performNostrSearch(searchTerm);
        break;
      // Add more cases for other search engines
      default:
        console.log("Unsupported search engine");
    }
  }
};
