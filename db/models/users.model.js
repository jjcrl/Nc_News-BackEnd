const db = require("../connection");



exports.fetchUsers = async () => {
    const users = await db.query("SELECT * FROM users;");
    return users.rows;
  };
  
  exports.fetchArticleById = async (article_id) => {
    const article = await db.query(
      `SELECT 
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.author,
      articles.article_id,
      articles.body,
      COUNT(comments.comment_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    );
    return article.rows;
  };