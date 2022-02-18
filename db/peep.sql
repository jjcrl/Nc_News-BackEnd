\c nc_news_test

-- SELECT 
-- articles.title,
-- articles.topic,
-- articles.created_at,
-- articles.votes,
-- articles.author,
-- articles.article_id,
-- COUNT(comments.comment_id) AS comment_count 
-- FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id;

-- SELECT 
--   articles.title,
--   articles.topic,
--   articles.created_at,
--   articles.votes,
--   articles.author,
--   articles.article_id,
--   articles.body,
--   COUNT(comments.comment_id) AS comment_count 
--   FROM articles
--   LEFT JOIN comments ON articles.article_id = comments.article_id
--   WHERE articles.article_id = 1
--   GROUP BY articles.article_id;

SELECT 
    UPDATE articles 
    SET articles.votes = articles.votes + 1 
    WHERE articles.article_id = 1 
    RETURN * ;