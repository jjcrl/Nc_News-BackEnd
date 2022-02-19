const {
  fetchArticles,
  fetchArticleById,
  patchArticleVote,
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
