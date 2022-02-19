exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "Page Not Found" });
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601") {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
};

exports.handleBadUser = (err, req, res, next) => {
  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    res.status(404).send({ msg: "Please login or signup" });
  }else next(err)
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
