const { checkExists } = require("../../utils");
const { fetchUsers, fetchUserByUsername } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUserByUsername(username)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `User ${username} Not Found`,
        });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};
