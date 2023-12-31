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
  deleteButton.className = "delete-button"; // Initially hidden

  // Disable the link button
  linkButton.disabled = true;

  // Add SVG for the delete button
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

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

function downloadData() {
  const allData = {};

  // Iterate over all keys in local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    allData[key] = value;
  }

  const blob = new Blob([JSON.stringify(allData)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "linklist.json";
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
                const data = JSON.parse(e.target.result);

                // Iterate over the keys in the loaded data and set them in local storage
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        localStorage.setItem(key, data[key]);
                    }
                }

                // Reload data on the page
                // Assuming there's a load function specific to your application
                loadData();
                // Close the dialog
                closeBackupRestoreDialog();
            };
            reader.readAsText(file);
        }
    };

    input.click();
}


document.getElementById('createFolderButton').addEventListener('click', createFolderAndSaveData);

async function createFolderAndSaveData() {
  try {
    const fileHandle = await window.showDirectoryPicker();
    const folderHandle = await fileHandle.getDirectoryHandle('YourFolderName', { create: true });
    
    // Access local storage data (assuming it's a key-value pair)
    const localStorageData = { ...localStorage };

    // Create a file inside the folder
    const fileHandleInFolder = await folderHandle.getFileHandle('localStorageData.json', { create: true });
    const writable = await fileHandleInFolder.createWritable();

    // Write the data as JSON
    await writable.write(JSON.stringify(localStorageData, null, 2));

    // Close the writable stream
    await writable.close();

    console.log('Data saved to folder as JSON successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}
