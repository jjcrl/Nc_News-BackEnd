const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
const { checkExists } = require("../../utils");
const {
  fetchArticles,
  fetchArticleById,
  patchArticleVote,
  insertArticle,
  removeArticle,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id ${article_id}`,
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVote = (req, res, next) => {
  const { articles_id } = req.params;
  const { inc_votes } = req.body;

  patchArticleVote(articles_id, inc_votes)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Resource Not Found" });
      }
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    removeArticle(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([article]) => {
      res.status(204).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
