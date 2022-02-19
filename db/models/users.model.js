const db = require("../connection");

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users;");
  return users.rows;
};

exports.fetchUserByUsername = async (username) => {
  const user = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return user.rows[0];
};
