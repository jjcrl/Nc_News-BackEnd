const res = require("express/lib/response");
const { fetchTopics, insertTopic } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
