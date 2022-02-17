const db = require("../db/connection");
const { checkExists } = require("./utils");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
  return topics.rows;
};

exports.fetchArticles = async (query) => {
  const validQueries = ["sort_by", "order", "topic"];

  let { sort_by, order, topic } = query;

  const [key] = Object.keys(query);

  if (key && !validQueries.includes(key)) {
    return Promise.reject({ status: 400, msg: `Invalid Input` });
  }

  if (!sort_by) {
    sort_by = "created_at";
  }
  if (!order) {
    order = "desc";
  }
  const validSorts = ["votes", "created_at", "topic", "title", "author"];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: `Cannot sort by ${sort_by}` });
  }

  let queryString = `SELECT * FROM articles `;
  if (topic) {
    queryString += `WHERE topic = '${topic}' `;
  }
  queryString += `ORDER BY ${sort_by} ${order};`;

  const articlesResult = await db.query(queryString);

  if (articlesResult.rows.length === 0) {
    await checkExists("topics", "slug", topic);
  }
  return articlesResult.rows;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT * FROM users;");
  return users.rows;
};

exports.fetchArticleById = async (article_id) => {
  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  return article.rows;
};

exports.fetchCommentsById = async (article_id) => {
  const comments = await db.query(
    `SELECT comments.author, comments.body, comments.comment_id,comments.created_at, comments.votes
    FROM comments 
    INNER JOIN articles 
    ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1 ;`,
    [article_id]
  );
  return comments.rows;
};
