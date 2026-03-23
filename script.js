window.msgs = [];

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

async function fetchMessages() {
  const response = await fetch("/msg/getAll");

  if (!response.ok) {
    throw new Error("Impossible de récupérer les messages.");
  }

  const messages = await response.json();
  window.msgs = messages;
  return messages;
}

async function createMessage(payload) {
  const messagePath = encodeURIComponent(payload.msg);
  const pseudoParam = encodeURIComponent(payload.pseudo);
  const dateParam = encodeURIComponent(new Date().toISOString());
  const response = await fetch(`/msg/post/${messagePath}?pseudo=${pseudoParam}&date=${dateParam}`);

  if (!response.ok) {
    throw new Error("Impossible d'ajouter le message.");
  }

  const index = await response.json();

  if (index === -1 || (typeof index === "object" && index.code === -1)) {
    throw new Error("Impossible d'ajouter le message.");
  }

  return {
    pseudo: payload.pseudo,
    msg: payload.msg,
    date: decodeURIComponent(dateParam),
  };
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

form.addEventListener("submit", async (event) => {
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

  try {
    const newMessage = await createMessage({
      pseudo,
      msg: content,
    });

    window.msgs.push(newMessage);
    update(window.msgs);
    form.reset();
    updateMessageCount();
    setStatus(formStatus, "Message publié et ajouté au fil de discussion.");
    setStatus(feedStatus, "La liste a été mise à jour avec le dernier message.");
    pseudoInput.focus();
  } catch (error) {
    setStatus(formStatus, error.message, "error");
  }
});

refreshButton.addEventListener("click", async () => {
  try {
    const messages = await fetchMessages();
    update(messages);
    setStatus(feedStatus, "Liste actualisée depuis le serveur.");
  } catch (error) {
    setStatus(feedStatus, error.message, "error");
  }
});

themeButton.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeButton.setAttribute("aria-pressed", String(isLight));
  themeButton.textContent = isLight ? "Passer en mode sombre" : "Passer en mode clair";
  setStatus(feedStatus, isLight ? "Le thème clair est actif." : "Le thème sombre est actif.");
});

window.update = update;
messageInput.addEventListener("input", updateMessageCount);

updateMessageCount();

fetchMessages()
  .then((messages) => {
    update(messages);
    setStatus(feedStatus, "Messages chargés depuis le serveur.");
  })
  .catch((error) => {
    update(window.msgs);
    setStatus(feedStatus, error.message, "error", true);
  });
