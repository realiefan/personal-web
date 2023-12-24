document.addEventListener("DOMContentLoaded", () => {
  // Load links from localStorage
  loadLinks();

  // Attach event listener for toggleDeleteButtons
  document
    .getElementById("toggleDeleteButton")
    .addEventListener("click", toggleDeleteButtons);
});

function openLinkAddingDialog() {
  document.getElementById("linkAddingDialog").showModal();
}

function closeLinkAddingDialog() {
  document.getElementById("linkAddingDialog").close();
}

function addLink() {
  const title = document.getElementById("newLinkTitle").value;
  let url = document.getElementById("newLinkURL").value;

  // Ensure the URL starts with "https://"
  if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (title && url) {
    const links = JSON.parse(localStorage.getItem("links")) || [];

    // Check for duplicate links
    const isDuplicate = links.some(
      (link) => link.title === title || link.url === url
    );
    if (isDuplicate) {
      alert("This link already exists.");
      return;
    }

    links.push({ title, url });
    localStorage.setItem("links", JSON.stringify(links));

    const linkContainer = document.getElementById("linksContainer");

    const linkDiv = createLinkContainer({ title, url });

    linkContainer.appendChild(linkDiv);

    // Clear input fields
    document.getElementById("newLinkTitle").value = "";
    document.getElementById("newLinkURL").value = "";

    // Close the modal
    closeLinkAddingDialog();
  } else {
    alert("Please enter both link title and URL");
  }
}


function createLinkContainer(link) {
  const linkDiv = document.createElement("div");
  linkDiv.className = "link-container";

  const linkButton = document.createElement("button");
  linkButton.textContent = link.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.className = "delete-button"; // Initially hidden

  // Event listener for link button
  linkButton.addEventListener("click", () => {
    window.location.href = link.url;
  });

  // Event listener for delete button
  deleteButton.addEventListener("click", () => {
    const links = JSON.parse(localStorage.getItem("links")) || [];
    const updatedLinks = links.filter(
      (l) => !(l.title === link.title && l.url === link.url)
    );
    localStorage.setItem("links", JSON.stringify(updatedLinks));

    // Remove the link container immediately
    linkDiv.remove();
  });

  linkDiv.appendChild(linkButton);
  linkDiv.appendChild(deleteButton);

  return linkDiv;
}


function loadLinks() {
  const linkContainer = document.getElementById("linksContainer");
  let links = JSON.parse(localStorage.getItem("links")) || [];

  // Sort the links alphabetically by title
  links.sort((a, b) => a.title.localeCompare(b.title));

  links.forEach((link) => {
    const linkDiv = createLinkContainer(link);
    linkContainer.appendChild(linkDiv);
  });
}

function toggleDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.classList.toggle("hidden-button");
  });
}

function goHome() {
  const homeLink = "/index.html";
  window.location.href = homeLink;
}



function openBackupRestoreDialog() {
  document.getElementById("backupRestoreDialog").showModal();
}

function closeBackupRestoreDialog() {
  document.getElementById("backupRestoreDialog").close();
}

document.addEventListener("DOMContentLoaded", () => {
  // ... (existing code)

  // Attach event listener for backup/restore button
  document
    .getElementById("backupRestoreButton")
    .addEventListener("click", openBackupRestoreDialog);

  // Attach event listener for download and restore buttons in the dialog
  document
    .getElementById("downloadDataButton")
    .addEventListener("click", downloadData);

  document
    .getElementById("restoreDataButton")
    .addEventListener("click", restoreData);
});

// Add these functions at the end of your JavaScript code

function downloadData() {
    const links = localStorage.getItem("links");
    const blob = new Blob([links], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "links_backup.json";
    link.click();
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                localStorage.setItem("links", data);
                // Reload links on the page
                loadLinks();
                // Close the dialog
                closeBackupRestoreDialog();
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

