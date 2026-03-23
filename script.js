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

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function update(messages) {
  messagesList.innerHTML = "";

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

  window.msgs.push({
    pseudo: pseudoInput.value,
    msg: messageInput.value,
    date: new Date().toISOString(),
  });

  update(window.msgs);
  form.reset();
});

refreshButton.addEventListener("click", () => {
  update(window.msgs);
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeButton.textContent = document.body.classList.contains("light-theme")
    ? "Passer en mode sombre"
    : "Passer en mode clair";
});

window.update = update;

update(window.msgs);
