const express = require("express");
const app = express();

const {
  getAllArticles,
  getArticleById,
  updateArticleVote
} = require("./db/controllers/articles.controller");

const { getAllTopics } = require("./db/controllers/topics.controller");

const { getAllUsers } = require("./db/controllers/users.controller");

const {
  getCommentsById,
  postComment,
} = require("./db/controllers/comments.controller");

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

app.patch('/api/articles/:articles_id' ,updateArticleVote)

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getAllUsers);

app.all("*", handle404);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use(handleBadUser);

app.use(handle500);

module.exports = app;
