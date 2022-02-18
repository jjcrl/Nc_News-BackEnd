const express = require("express");
const app = express();

const {
  getAllTopics,
  getAllArticles,
  getAllUsers,
  getArticleById,
  getCommentsById,
  postComment,
} = require("./controllers/controllers");

const {
  handle404,
  handleCustomError,
  handlePsqlError,
  handle500,
  handleBadUser,
} = require("./error_handling/app.errors");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getAllUsers);

app.all("*", handle404);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use(handleBadUser);

app.use(handle500);

module.exports = app;
