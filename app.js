const express = require("express");
const app = express();

const {
  getAllTopics,
  getAllArticles,
  getAllUsers,
  getArticleById,
  getCommentsById
} = require("./controllers/controllers");

const { handle404, handleCustomError, handlePsqlError } = require("./error_handling/app.errors");

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id",getArticleById)

app.get("/api/articles/:article_id/comments",getCommentsById)

app.get("/api/users", getAllUsers);

app.all("*", handle404);

app.use(handleCustomError)

app.use(handlePsqlError)

module.exports = app;
