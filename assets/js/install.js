let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = event;

  // Update UI to notify the user they can add to home screen
  document.getElementById("installButton").style.display = "block";
});

// Handle the install button click event
document.getElementById("installButton").addEventListener("click", () => {
  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Reset the deferred prompt variable
    deferredPrompt = null;

    // Hide the install button
    document.getElementById("installButton").style.display = "none";
  });
});
