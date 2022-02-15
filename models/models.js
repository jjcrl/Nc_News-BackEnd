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

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users;");
  return users.rows;
};

exports.fetchArticleById = async (article_id) => {
  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  return article.rows;
};
