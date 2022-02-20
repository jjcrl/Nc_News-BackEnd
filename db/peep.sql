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

-- SELECT 
--     UPDATE articles 
--     SET articles.votes = articles.votes + 1 
--     WHERE articles.article_id = 1 
--     RETURN * ;

-- INSERT INTO articles (author,body,topic,title) 
-- VALUES ('butter_bridge','test','paper','test')

--insertion of new article
-- INSERT INTO articles (author,body,topic,title) 
-- VALUES ('butter_bridge','test','paper','test') 
-- RETURNING;

--when returning we want to return a newwly added comment count 
-- what would be the best order for this ? 




SELECT * FROM articles;

--comment_count
    -- COUNT(comments.comment_id) AS comment_count 
    -- FROM articles
    -- LEFT JOIN comments ON articles.article_id = comments.article_id
    -- WHERE articles.article_id = $1
    -- GROUP BY articles.article_id;
