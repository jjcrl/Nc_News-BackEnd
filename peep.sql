\c nc_news_test

SELECT * 
FROM comments 
LEFT JOIN articles 
ON comments.comment_id = articles.article_id
AND comments.article_id = 1 ;