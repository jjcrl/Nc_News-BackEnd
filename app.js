const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topics.controllers");
const { handle404 } = require("./error_handling/app.errors");

app.get("/api/topics", getAllTopics);

app.all("*",handle404)

module.exports = app;
