const express = require("express");
const app = express();

const { getAllTopics,getAllArticles } = require("./controllers/topics.controllers");

const { handle404 } = require("./error_handling/app.errors");

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.all("*", handle404);

module.exports = app;
