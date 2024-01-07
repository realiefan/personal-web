document.addEventListener("DOMContentLoaded", () => {
  // Load links from localStorage or add defaults
  loadLinks();

  // Attach event listener for toggleDeleteButtons
});

function openLinkAddingDialog() {
  document.getElementById("linkAddingDialog").showModal();
}

function closeLinkAddingDialog() {
  document.getElementById("linkAddingDialog").close();
}

function addLink() {
  const title = document.getElementById("newLinkTitle").value;
  const url = document.getElementById("newLinkURL").value;

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
  linkButton.className = "mainButton";

  linkButton.addEventListener("click", () => {
    // Increment click count for the URL
    updateLinkClickCount(link.url, link.title); // Pass title as additional information

    // Open the link URL in a new window
    window.open(link.url, "_self");
  });

  linkDiv.appendChild(linkButton);

  // Fetch icon asynchronously and append it to the link container
  fetchIcon(link.url)
    .then((iconURL) => {
      return new Promise((resolve) => {
        const icon = document.createElement("img");
        icon.src = iconURL;
        icon.alt = `${link.title} Icon`;
        icon.className = "link-icon";

        // Modify the event listener for the icon
        icon.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default behavior of following the link

          // Increment click count for the URL
          updateLinkClickCount(link.url, link.title); // Pass title as additional information

          // Open the link URL in a new window
          window.open(link.url, "_self");
        });

        // Append icon to the link container
        linkDiv.insertBefore(icon, linkButton); // Insert icon before the button

        resolve(); // Resolve the promise once the icon is appended
      });
    })
    .catch((error) => {
      console.error("Error fetching icon:", error);
    });

  return linkDiv;
}

function fetchIcon(url) {
  const urlWithoutProtocol = url.replace(/^https?:\/\//, ""); // Remove "https://" or "http://"
  const iconURL = `https://icon.horse/icon/${urlWithoutProtocol}`;
  return Promise.resolve(iconURL);
}


function updateLinkClickCount(url, title) {
  const linkUsageData = getLinkUsageData();
  const linkInfo = linkUsageData[url] || {
    count: 0,
    title: title,
    lastAccessTime: null,
    performance: null,
  };

  // Increment click count for the URL
  linkInfo.count += 1;

  // Update the latest access time
  linkInfo.lastAccessTime = new Date().toISOString();

  // Remove the code related to performance measurement
  // linkInfo.performance = null;

  // Update the link usage data in local storage
  linkUsageData[url] = linkInfo;
  setLinkUsageData(linkUsageData);
}

// Add this function to your existing code
function getLinkUsageData() {
  return JSON.parse(localStorage.getItem("linkUsageData")) || {};
}

function setLinkUsageData(data) {
  localStorage.setItem("linkUsageData", JSON.stringify(data));
}





function loadLinks() {
  const linkContainer = document.getElementById("linksContainer");
  let links = loadLinksFromLocalStorage();

  if (links.length === 0) {
    links = setDefaultLinks();
  }

  sortLinksAlphabetically(links);

  links.forEach((link) => {
    const linkDiv = createLinkContainer(link);
    linkContainer.appendChild(linkDiv);
  });
}

function loadLinksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("links")) || [];
}

function setDefaultLinks() {
  const defaultLinks = [
  {"id":"habla-embed","url":"https://habla.news/","title":"Habla"},
  {"id":"perplexity-embed","url":"https://www.perplexity.ai/","title":"Perplexity"},
  {"id":"archive-embed","url":"https://archive.org/","title":"Archive"},
  {"id":"nostrbuild-embed","url":"https://nostr.build/","title":"Nostr.Build"},
  {"id":"nostrband-embed","url":"https://nostr.band/","title":"Nostr.Band"},
  {"id":"nostrudel-embed","url":"https://nostrudel.ninja/","title":"noStrudel"},
  {"id":"satellite-embed","url":"https://satellite.earth/","title":"Satellite"},
  {"id":"stacker-embed","url":"https://stacker.news/","title":"Stacker"},
  {"id":"oddbean-embed","url":"https://oddbean.com/","title":"Oddbean"},
  {"title":"Reddit","url":"https://www.reddit.com/"},
  {"title":"Wormhole","url":"https://wormhole.app/"},
  {"title":"Memo Ai","url":"https://www.recordergo.app/"},
  {"title":"Wikipedia","url":"https://wikipedia.org/"},
  {"title":"Shopstr","url":"https://shopstr.store/"},
  {"title":"ProtonMail","url":"https://mail.proton.me/"},
  {"title":"Rumble","url":"https://rumble.com/"},
  {"title":"BlueSky","url":"https://bsky.app/"},
  {"title":"Coracle","url":"https://coracle.social/"},
  {"title":"Snort","url":"https://Snort.social"},
  {"title":"ShipYard","url":"https://shipyard.pub/"},
  {"title":"Stream","url":"https://zap.stream/"},
  {"title":"Flare","url":"https://www.flare.pub/"},
  {"title":"Primal","url":"https://primal.net/home"},
  {"title":"Unleashed","url":"https://unleashed.chat/"},
  {"title":"Poa.st","url":"https://poa.st/"},
  {"title":"X","url":"https://twitter.com/home"},
  {"title":"Sendstr","url":"https://sendstr.com"},
  {"title":"Pinstr","url":"https://pinstr.app/"},
  {"title":"Highlighter","url":"https://highlighter.com/"},
  {"title":"Nostr Nests","url":"https://nostrnests.com/"},
  {"title":"wavlake","url":"https://www.wavlake.com/"}
];
  localStorage.setItem("links", JSON.stringify(defaultLinks));
  return defaultLinks;
}

function sortLinksAlphabetically(links) {
  links.sort((a, b) => a.title.localeCompare(b.title));
}
