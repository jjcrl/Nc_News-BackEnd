const db = require("./db/connection");
const format = require("pg-format");

exports.checkExists = async (table, column, value) => {
  const queryString = format("SELECT * FROM %I wHERE %I = $1", table, column);
  const dbOutput = await db.query(queryString, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Page Not Found" });
  }
};
