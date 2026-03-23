window.msgs = [
  {
    pseudo: "Alice",
    msg: "Je suis persuadée que les IA ne remplaceront jamais les ingénieurs.",
    date: "2026-03-05T09:15:32",
  },
  {
    pseudo: "Bob",
    msg: "Je ne suis pas d'accord, les avancées sont bien trop rapides.",
    date: "2026-03-05T09:42:14",
  },
  {
    pseudo: "Charlie",
    msg: "Personnellement, je suis plus inquiet pour les analystes en finance que pour les ingénieurs.",
    date: "2026-03-05T10:05:58",
  },
  {
    pseudo: "David",
    msg: "Moi j'attends seulement la mise en place du revenu universel et la fin du travail pour les humains.",
    date: "2026-03-05T13:34:03",
  },
  {
    pseudo: "Elise",
    msg: "L'idée paraît séduisante, mais c'est la meilleure manière de créer une sous-classe permanente d'humains à la merci des IAs et des milliardaires.",
    date: "2026-03-05T15:12:27",
  },
];

const messagesList = document.querySelector("#messages");
const form = document.querySelector("#post-form");
const pseudoInput = document.querySelector("#pseudo");
const messageInput = document.querySelector("#message");
const refreshButton = document.querySelector("#refresh");
const themeButton = document.querySelector("#toggle-theme");
const messageSummary = document.querySelector("#message-summary");
const emptyState = document.querySelector("#empty-state");
const formStatus = document.querySelector("#form-status");
const feedStatus = document.querySelector("#feed-status");
const messageCount = document.querySelector("#message-count");

const MAX_MESSAGE_LENGTH = 280;
const STATUS_TIMEOUT = 2200;

let formStatusTimer;
let feedStatusTimer;

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function setStatus(element, message, tone = "success", persist = false) {
  clearTimeout(element === formStatus ? formStatusTimer : feedStatusTimer);

  if (!message) {
    element.textContent = "";
    element.className = "status-banner";
    return;
  }

  element.textContent = message;
  element.className = `status-banner is-visible ${tone === "error" ? "is-error" : "is-success"}`;

  if (persist) {
    return;
  }

  const timer = window.setTimeout(() => {
    element.textContent = "";
    element.className = "status-banner";
  }, STATUS_TIMEOUT);

  if (element === formStatus) {
    formStatusTimer = timer;
  } else {
    feedStatusTimer = timer;
  }
}

function updateMessageCount() {
  messageCount.textContent = `${messageInput.value.length} / ${MAX_MESSAGE_LENGTH}`;
}

function updateSummary(count) {
  messageSummary.textContent = `${count} message${count > 1 ? "s" : ""} affiché${count > 1 ? "s" : ""}`;
}

function sanitizeFieldValue(value) {
  return value.trim().replace(/\s+/g, " ");
}

function update(messages) {
  messagesList.innerHTML = "";
  emptyState.hidden = messages.length > 0;
  updateSummary(messages.length);

  messages.forEach((message, index) => {
    const item = document.createElement("li");
    const article = document.createElement("article");
    const header = document.createElement("header");
    const author = document.createElement("h2");
    const details = document.createElement("span");
    const time = document.createElement("time");
    const content = document.createElement("p");

    author.textContent = message.pseudo;
    time.dateTime = message.date;
    time.textContent = formatDate(message.date);
    details.append(index === 0 ? "a écrit le " : "a répondu le ", time, " :");
    content.textContent = message.msg;

    header.append(author, details);
    article.append(header, content);
    item.append(article);
    messagesList.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const pseudo = sanitizeFieldValue(pseudoInput.value);
  const content = messageInput.value.trim();

  if (!pseudo) {
    pseudoInput.focus();
    setStatus(formStatus, "Le pseudo est requis pour publier un message.", "error");
    return;
  }

  if (!content) {
    messageInput.focus();
    setStatus(formStatus, "Le message ne peut pas être vide.", "error");
    return;
  }

  window.msgs.push({
    pseudo,
    msg: content,
    date: new Date().toISOString(),
  });

  update(window.msgs);
  form.reset();
  updateMessageCount();
  setStatus(formStatus, "Message publié et ajouté au fil de discussion.");
  setStatus(feedStatus, "La liste a été mise à jour avec le dernier message.");
  pseudoInput.focus();
});

refreshButton.addEventListener("click", () => {
  update(window.msgs);
  setStatus(feedStatus, "Liste actualisée à partir de la variable window.msgs.");
});

themeButton.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeButton.setAttribute("aria-pressed", String(isLight));
  themeButton.textContent = isLight ? "Passer en mode sombre" : "Passer en mode clair";
  setStatus(feedStatus, isLight ? "Le thème clair est actif." : "Le thème sombre est actif.");
});

window.update = update;
messageInput.addEventListener("input", updateMessageCount);

update(window.msgs);
updateMessageCount();
