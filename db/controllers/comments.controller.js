const {
  fetchCommentsById,
  insertComment,
  removeComment,
  patchCommentVote,
} = require("../models/comments.model");

const { checkExists } = require("../../utils");

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsById(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  patchCommentVote(inc_votes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
