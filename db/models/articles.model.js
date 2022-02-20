const db = require("../connection");
const { checkExists } = require("../../utils");

exports.fetchArticles = async (query) => {
  const validQueries = ["sort_by", "order", "topic"];

  let { sort_by } = query;
  let { order } = query;
  let { topic } = query;

  const queryKeys = Object.keys(query);
  for (const query of queryKeys) {
    if (!validQueries.includes(query)) {
      return Promise.reject({ status: 400, msg: "Invalid Input" });
    }
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

  let queryString = `SELECT 
    articles.title,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.author,
    articles.article_id,
    COUNT(comments.comment_id) 
    AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += `WHERE topic = '${topic}' `;
  }

  queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const articlesResult = await db.query(queryString);

  if (articlesResult.rows.length === 0) {
    await checkExists("topics", "slug", topic);
  }
  return articlesResult.rows;
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

exports.patchArticleVote = async (article_id, vote) => {
  const updatedArticle = await db.query(
    `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *`,
    [vote, article_id]
  );
  return updatedArticle.rows[0];
};

exports.insertArticle = async (article) => {
  const { author } = article;
  const { body } = article;
  const { topic } = article;
  const { title } = article;

  if (body.length === 0 || body === undefined) {
    return Promise.reject({
      status: 400,
      msg: "A new article requires a body",
    });
  } else if (title.length === 0 || title === undefined) {
    return Promise.reject({
      status: 400,
      msg: "A new article requires a title",
    });
  }

  const insert = await db.query(
    `INSERT INTO articles (author,body,topic,title) VALUES ($1,$2,$3,$4) RETURNING article_id;`,
    [author, body, topic, title]
  );

  const { article_id } = insert.rows[0];

  const newArticle = await db.query(
    `
  SELECT 
  articles.title,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.author,
  articles.article_id,
  articles.body,
COUNT (comments.comment_id) AS comment_count 
FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id 
WHERE articles.article_id = $1
GROUP BY articles.article_id;`,
    [article_id]
  );

  return newArticle.rows[0];
};
