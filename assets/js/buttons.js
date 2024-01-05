const CONFIG = {
  // General
  name: "Nostrich",
  imageBackground: false,
  openInNewTab: false,

  // Layout
  bentoLayout: "bento",

  firstButtonsContainer: [
    {
      id: "2",
      name: "Gmail",
      icon: "database-zap",
	  
      link: "/assets/pages/backup/backup.html",
    },
    {
      id: "5",
      name: "Wallet",
      icon: "zap",
      link: "/assets/pages/wallet/wallet.html",
    },
    {
      id: "1",
      name: "Calendar",
      icon: "calendar-check-2",
      link: "/offline",
    },
    {
      id: "3",
      name: "Setting",
      icon: "settings",
      link: "/assets/pages/control/control.html",
    },
  ],

  secondButtonsContainer: [
    // Add your second set of buttons here
    {
      id: "6",
      name: "Example",
      icon: "example-icon",
      link: "/assets/pages/example/example.html",
    },
    // Add more buttons as needed
  ],
};

const generateLayout = () => {
  let firstButtonsContainer = `
    <div class="buttonsContainer" id="buttons_1"></div>
  `;
  let secondButtonsContainer = `
    <div class="buttonsContainer" id="buttons_2"></div>
  `;
  let firstListsContainer = `
    <div class="listsContainer" id="lists_1"></div>
  `;

  let secondListsContainer = `
    <div class="listsContainer" id="lists_2"></div>
  `;

  const position = "beforeend";

  switch (CONFIG.bentoLayout) {
    case "bento":
      linksBlockLeft.insertAdjacentHTML(position, firstButtonsContainer);

      linksBlock.classList.remove("reduceGap");
      linksBlock.classList.remove("removeGap");
      break;
    case "lists":
      linksBlockLeft.insertAdjacentHTML(position, firstListsContainer);
      linksBlock.classList.add("reduceGap");
      break;
    case "buttons":
      linksBlockLeft.insertAdjacentHTML(position, firstButtonsContainer);
      linksBlock.classList.add("removeGap");
      break;
    default:
      break;
  }
};

generateLayout();

const generateFirstButtonsContainer = () => {
  for (const button of CONFIG.firstButtonsContainer) {
    let item = `
        <a
          href="${button.link}"
          target="${CONFIG.openInNewTab ? "_blank" : ""}"
          class="card button button__${button.id}"
        >
          <i class="buttonIcon" data-lucide="${button.icon}"></i>
        </a>
    `;

    const position = "beforeend";

    buttons_1.insertAdjacentHTML(position, item);
  }
};

const generateSecondButtonsContainer = () => {
  for (const button of CONFIG.secondButtonsContainer) {
    let item = `
        <a
          href="${button.link}"
          target="${CONFIG.openInNewTab ? "_blank" : ""}"
          class="card button button__${button.id}"
        >
          <i class="buttonIcon" data-lucide="${button.icon}"></i>
        </a>
    `;

    const position = "beforeend";

    buttons_2.insertAdjacentHTML(position, item);
  }
};

const generateButtons = () => {
  switch (CONFIG.bentoLayout) {
    case "bento":
      generateFirstButtonsContainer();
      break;
    case "buttons":
      generateFirstButtonsContainer();
      generateSecondButtonsContainer();
      break;
    default:
      break;
  }
};

generateButtons();
