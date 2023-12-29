const LINK_CONTAINER_ID = "linksContainer";
const LINK_DIALOG_ID = "linkAddingDialog";

document.addEventListener("DOMContentLoaded", () => {
  loadLinks();
  // Attach event listener for toggleDeleteButtons (if needed)
});

function openLinkAddingDialog() {
  getDialogElement().showModal();
}

function closeLinkAddingDialog() {
  getDialogElement().close();
}

function addLink() {
  const titleInput = getElement("newLinkTitle");
  const urlInput = getElement("newLinkURL");

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (isValidLink(title, url)) {
    const links = getStoredLinks();

    if (isDuplicateLink(links, { title, url })) {
      alert("This link already exists.");
      return;
    }

    links.push({ title, url });
    setStoredLinks(links);

    const linkContainer = getElement(LINK_CONTAINER_ID);
    const linkDiv = createLinkContainer({ title, url });

    linkContainer.appendChild(linkDiv);

    clearInputFields(titleInput, urlInput);
    closeLinkAddingDialog();
  } else {
    alert("Please enter both link title and URL");
  }
}

function createLinkContainer(link) {
  const linkDiv = createElement("div", "link-container");
  const linkButton = createElement("button", "mainButton", link.title);

  linkButton.addEventListener("click", () => redirectToLink(link.url));

  fetchIcon(link.url)
    .then((iconURL) => {
      const icon = createIconElement(iconURL, link.title, link.url);
      linkDiv.insertBefore(icon, linkButton);
    })
    .catch((error) => {
      console.error("Error fetching icon:", error);
    });

  linkDiv.appendChild(linkButton);
  return linkDiv;
}

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  element.className = className;

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function redirectToLink(url) {
  // Record start time in sessionStorage after a small delay
  setTimeout(() => {
    sessionStorage.setItem(
      "startTime",
      JSON.stringify({ url, time: Date.now() })
    );
  }, 100);

  // Redirect to the link
  window.location.href = url;
}

// Listen for pagehide event (when the page is about to be hidden)
window.addEventListener("pagehide", () => {
  // Record the current time in sessionStorage
  sessionStorage.setItem("pagehideTime", Date.now().toString());
});

// Listen for pageshow event (when the page becomes visible again)
window.addEventListener("pageshow", (event) => {
  // Check if the event's persisted attribute is false (indicating a real page reload)
  if (!event.persisted) {
    // Page is visible again, calculate time spent
    const startTimeData = JSON.parse(sessionStorage.getItem("startTime"));

    if (startTimeData) {
      const { url } = startTimeData;
      const pagehideTime = sessionStorage.getItem("pagehideTime");
      const endTime = Date.now();
      const timeSpent = pagehideTime
        ? endTime - Math.max(startTimeData.time, parseInt(pagehideTime, 10))
        : 0;

      // Update link usage without requiring refresh
      updateLinkUsage(url, timeSpent);

      // Clear stored start time and pagehide time
      sessionStorage.removeItem("startTime");
      sessionStorage.removeItem("pagehideTime");
    }
  }
});

function updateLinkUsage(url, timeSpent) {
  const linkUsageData = getLinkUsageData();

  if (linkUsageData[url]) {
    // If the URL is already in the data, update the existing entry
    linkUsageData[url].count += 1;
    linkUsageData[url].lastAccessed = new Date().toISOString();
  } else {
    // If the URL is not in the data, create a new entry
    linkUsageData[url] = {
      count: 1,
      lastAccessed: new Date().toISOString(),
    };
  }

  setLinkUsageData(linkUsageData);
}

// ... (unchanged)

function getLinkUsageData() {
  return JSON.parse(sessionStorage.getItem("linkUsageData")) || {};
}

function setLinkUsageData(data) {
  sessionStorage.setItem("linkUsageData", JSON.stringify(data));
}


// ... (unchanged)

function getLinkUsageData() {
  return JSON.parse(localStorage.getItem("linkUsageData")) || {};
}

function setLinkUsageData(data) {
  localStorage.setItem("linkUsageData", JSON.stringify(data));
}




function fetchIcon(url) {
  const urlWithoutProtocol = url.replace(/^https?:\/\//, "");
  return Promise.resolve(`https://icon.horse/icon/${urlWithoutProtocol}`);
}

function loadLinks() {
  const linkContainer = getElement(LINK_CONTAINER_ID);
  let links = getStoredLinks();

  if (!links || links.length === 0) {
    links = setDefaultLinks();
  }

  sortLinksAlphabetically(links);

  links.forEach((link) => {
    const linkDiv = createLinkContainer(link);
    linkContainer.appendChild(linkDiv);
  });
}

function createIconElement(iconURL, title, url) {
  const iconContainer = createElement("div", "icon-container");
  const icon = createElement("img", "link-icon");

  icon.src = iconURL;
  icon.alt = `${title} Icon`;

  icon.addEventListener("click", (event) => {
    event.preventDefault();
    redirectToLink(url);
  });

  iconContainer.appendChild(icon);
  return iconContainer;
}

function isValidLink(title, url) {
  return title && url;
}

function getDialogElement() {
  return getElement(LINK_DIALOG_ID);
}

function getElement(elementId) {
  return document.getElementById(elementId);
}

function isDuplicateLink(links, newLink) {
  return links.some(
    (link) => link.title === newLink.title || link.url === newLink.url
  );
}

function getStoredLinks() {
  return JSON.parse(localStorage.getItem("links")) || [];
}

function setStoredLinks(links) {
  localStorage.setItem("links", JSON.stringify(links));
}

function setDefaultLinks() {
  const defaultLinks = [
    { id: "bard-embed", url: "https://bard.google.com/", title: "Bard" },
    { id: "habla-embed", url: "https://habla.news/", title: "Habla" },
    {
      id: "perplexity-embed",
      url: "https://www.perplexity.ai/",
      title: "Perplexity",
    },
    { id: "archive-embed", url: "https://archive.org/", title: "Archive" },
    {
      id: "nostrbuild-embed",
      url: "https://nostr.build/",
      title: "Nostr.Build",
    },
    { id: "nostrband-embed", url: "https://nostr.band/", title: "Nostr.Band" },
    {
      id: "nostrudel-embed",
      url: "https://nostrudel.ninja/",
      title: "noStrudel",
    },
    {
      id: "satellite-embed",
      url: "https://satellite.earth/",
      title: "Satellite",
    },
    { id: "stacker-embed", url: "https://stacker.news/", title: "Stacker" },
    { id: "oddbean-embed", url: "https://oddbean.com/", title: "Oddbean" },
    { title: "Brave", url: "https://search.brave.com/" },
    { title: "X", url: "https://twitter.com/" },
    { title: "Reddit", url: "https://www.reddit.com/" },
    { title: "Wormhole", url: "https://wormhole.app/" },
    { title: "GitHub", url: "https://github.com/" },
    { title: "Memo Ai", url: "https://www.recordergo.app/" },
    { title: "Wikipedia", url: "https://wikipedia.org/" },
    { title: "Shopstr", url: "https://shopstr.store/" },
    { title: "UnleashedChat ", url: "https://unleashed.chat/" },
    { title: "ProtonMail", url: "https://mail.proton.me/" },
    { title: "NostrApps", url: "https://nostrapp.link/" },
    { title: "Rumble", url: "https://rumble.com/" },
    { title: "BlueSky", url: "https://bsky.app/" },
    { title: "Coracle", url: "https://coracle.social/" },
    { title: "CallOfWar", url: "https://www.callofwar.com/" },
    { title: "Snort", url: "https://Snort.social" },
    { title: "ShipYard", url: "https://shipyard.pub/" },
    { title: "Stream", url: "https://zap.stream/" },
  ];
  localStorage.setItem("links", JSON.stringify(defaultLinks));
  return defaultLinks;
}

function sortLinksAlphabetically(links) {
  links.sort((a, b) => a.title.localeCompare(b.title));
}
