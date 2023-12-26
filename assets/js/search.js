


 function performGoogleSearch() {
   var searchTerm = document.getElementById("googleSearch").value;
   // Add your logic to perform the Google search with the searchTerm
   // For example, you can redirect the user to the Google search results page
   window.location.href =
     "https://duckduckgo.com/?q=" + encodeURIComponent(searchTerm) + "&hps=1&start=1&ia=web";
 }

document.getElementById("googleSearch").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        performGoogleSearch();
    }
});
