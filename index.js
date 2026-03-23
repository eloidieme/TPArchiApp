var express = require("express");
var path = require("path");

var app = express();
var port = process.env.PORT || 8080;

var allMsgs = [
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/msg/getAll", function(req, res) {
  res.json(allMsgs);
});

app.get("/msg/nber", function(req, res) {
  res.json(allMsgs.length);
});

app.get("/msg/get/*splat", function(req, res) {
  var rawIndex = req.params.splat[0];
  var index = parseInt(rawIndex, 10);

  if (Number.isNaN(index) || index < 0 || index >= allMsgs.length) {
    return res.json({ code: 0 });
  }

  res.json({
    code: 1,
    msg: allMsgs[index],
  });
});

app.get("/msg/post/*splat", function(req, res) {
  var rawMessage = req.params.splat[0];
  var msg = decodeURIComponent(rawMessage || "").trim();
  var pseudo = typeof req.query.pseudo === "string" ? req.query.pseudo.trim() : "Anonyme";
  var date = typeof req.query.date === "string" && req.query.date.trim()
    ? req.query.date.trim()
    : new Date().toISOString();

  if (!msg) {
    return res.json({ code: -1 });
  }

  allMsgs.push({
    pseudo: pseudo || "Anonyme",
    msg: msg,
    date: date,
  });

  res.json(allMsgs.length - 1);
});

app.get("/msg/del/*splat", function(req, res) {
  var rawIndex = req.params.splat[0];
  var index = parseInt(rawIndex, 10);

  if (Number.isNaN(index) || index < 0 || index >= allMsgs.length) {
    return res.json({ code: 0 });
  }

  allMsgs.splice(index, 1);
  res.json({ code: 1 });
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, function() {
  console.log("App listening on port " + port + "...");
});
