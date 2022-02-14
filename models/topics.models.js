const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
  return topics.rows;
};

exports.fetchArticles = async () => {
  const articles = await db.query(
    "SELECT * FROM articles ORDER BY created_at desc;"
  );
  return articles.rows;
};
