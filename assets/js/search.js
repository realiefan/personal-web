


 function performGoogleSearch() {
   var searchTerm = document.getElementById("googleSearch").value;
   // Add your logic to perform the Google search with the searchTerm
   // For example, you can redirect the user to the Google search results page
   window.location.href =
     "https://www.duckduckgo.com/search?q=" + encodeURIComponent(searchTerm);
 }

document.getElementById("googleSearch").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        performGoogleSearch();
    }
});
