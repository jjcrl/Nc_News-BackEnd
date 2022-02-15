const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
  return topics.rows;
};

exports.fetchArticles = async (query) => {
  let { sort_by,order,topic } = query;

  if (!sort_by) {
    sort_by = "created_at";
  }
  if (!order) {
    order = "desc";
  }

  const validSorts = ["votes", "created_at", "topic", "title", "author"];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: `Cannot sort by ${sort_by}` });
  }

  let queryString = `SELECT * FROM articles `;
  if (topic) {
    queryString += `WHERE topic = '${topic}' `;
  }
  queryString += `ORDER BY ${sort_by} ${order};`;

  const articles = await db.query(queryString);
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
