const express = require("express");
const app = express();

const {
  getAllArticles,
  getArticleById,
  updateArticleVote,
  postArticle,
  deleteArticleById,
} = require("./db/controllers/articles.controller");

const {
  getAllTopics,
  postTopic,
} = require("./db/controllers/topics.controller");

const {
  getAllUsers,
  getUserByUsername,
} = require("./db/controllers/users.controller");

const {
  getCommentsById,
  postComment,
  deleteCommentById,
  updateCommentVote,
} = require("./db/controllers/comments.controller");

const {
  handle404,
  handleCustomError,
  handlePsqlError,
  handle500,
  handleBadUser,
  handleBadArticle,
} = require("./error_handling/app.errors");

const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({endpoints});
});

app.get("/api/topics", getAllTopics);

app.post("/api/topics", postTopic);

app.get("/api/articles", getAllArticles);

app.post("/api/articles", postArticle);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:articles_id", updateArticleVote);

app.delete("/api/articles/:article_id", deleteArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getAllUsers);

app.get("/api/users/:username", getUserByUsername);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.patch("/api/comments/:comment_id", updateCommentVote);

app.all("*", handle404);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use(handleBadUser);

app.use(handleBadArticle);

app.use(handle500);

module.exports = app;
