const request = require("supertest");
const { response } = require("../app");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("ENDPOINT TESTING", () => {
  describe("/api/topics", () => {
    describe("GET", () => {
      test("200: Should respond with an array of topic objects, each with a slug and description property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.topics)).toBe(true);
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
      test("404: Incorrect path names should reposnd with 404 status and invalid path message", () => {
        return request(app)
          .get("/api/badpath")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Page Not Found");
          });
      });
    });
    describe("POST", () => {
      test("201: Should take a topic object with a description and a slug. Returning the newly posted topic", () => {
        const newTopic = { slug: "tech", description: "machine go beep boop" };
        return request(app)
          .post("/api/topics")
          .send(newTopic)
          .expect(201)
          .then((response) => {
            expect(response.body.topic).toEqual({
              slug: "tech",
              description: "machine go beep boop",
            });
          });
      });
    });
  });

  describe("/api/articles", () => {
    describe("GET", () => {
      test("200: Should respond with an array of article objects , each with the properties title,article_id,topic,created_at,votes and author  which is the username from the users table", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.articles)).toBe(true);
            expect(response.body.articles.length).toBe(12);
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("200: Should default to sorted by date descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
          });
      });
    });
    describe("POST", () => {
      test("201: Should take a new article object containing author title body topic, reposing with the newly posted article", () => {
        const newArticle = {
          author: "butter_bridge",
          title: "copy no fax",
          body: "brrrr",
          topic: "paper",
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(201)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                author: "butter_bridge",
                title: "copy no fax",
                body: "brrrr",
                topic: "paper",
                article_id: 13,
                votes: 0,
                comment_count: "0",
                created_at: expect.any(String),
              })
            );
          });
      });
      test("404: Should resposnd with a 404 error when the author is not in the database", () => {
        const newArticle = {
          author: "jjcrl",
          title: "fax no copy",
          body: "brrrr",
          topic: "paper",
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Please login or signup");
          });
      });
      test("404: Should repsond with a 404 error should the new articles topic not exist", () => {
        const newArticle = {
          author: "butter_bridge",
          title: "fax no copy",
          body: "brrrr",
          topic: "I dont exist",
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(
              "Articles require exisiting topics, please check topic"
            );
          });
      });
      test("400: Should reposnd with a 400 error if the body is empty", () => {
        const newArticle = {
          author: "butter_bridge",
          title: "copy no fax",
          body: "",
          topic: "paper",
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("A new article requires a body");
          });
      });
      test("400: Should return a 400 error if the title is empty", () => {
        const newArticle = {
          author: "butter_bridge",
          title: "",
          body: "brrrr",
          topic: "paper",
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("A new article requires a title");
          });
      });
    });
  });

  describe("/api/users", () => {
    describe("GET", () => {
      test("200: Should respond with an array of user objects each with the a username property", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.users)).toBe(true);
            expect(response.body.users.length).toBe(4);
            response.body.users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("200: Should respond with an object containg the username , avatar_url and name", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then((response) => {
            expect(response.body.user).toEqual(
              expect.objectContaining({
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              })
            );
          });
      });
      test("404: Should respond with 404 error when given username does not exist", () => {
        return request(app)
          .get("/api/users/jjcrl")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("User jjcrl Not Found");
          });
      });
    });
  });

  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("200: Should reposnd with an article object that has author which is the username from the users table, title, article_id, body, topic, created_at, votes, properties.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                author: "butter_bridge",
                body: "I find this existence challenging",
                title: "Living in the shadow of a great man",
                article_id: 1,
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
              })
            );
          });
      });
      test("404: Should respond with 404 when article id does not exisit", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(
              "No article found for article_id 100"
            );
          });
      });
      test("400: Should respond with 400 when passed invalid query", () => {
        return request(app)
          .get("/api/articles/twelve")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });

    describe("PATCH", () => {
      test("200: Should take an vote object and update the current articles votes returning the updated article object", () => {
        const newVote = 1;
        const vote = { inc_votes: newVote };
        return request(app)
          .patch("/api/articles/1")
          .send(vote)
          .expect(201)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101,
              })
            );
          });
      });
      test("200: Should be also be able to update the articles votes in a negative manor", () => {
        const newVote = -1;
        const vote = { inc_votes: newVote };
        return request(app)
          .patch("/api/articles/1")
          .send(vote)
          .expect(201)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 99,
              })
            );
          });
      });

      test("404: Should return 404 error when article_id does not exist", () => {
        const newVote = 1;
        const vote = { inc_votes: newVote };
        return request(app)
          .patch("/api/articles/1000")
          .send(vote)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Resource Not Found");
          });
      });
      test("400: Should return 400 error when article_id is invalid", () => {
        const newVote = 1;
        const vote = { inc_votes: newVote };
        return request(app)
          .patch("/api/articles/ten")
          .send(vote)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
      test("400: Should return a 400 error when non numerical value is passed as a vote", () => {
        const newVote = "one";
        const vote = { inc_votes: newVote };
        return request(app)
          .patch("/api/articles/1")
          .send(vote)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });
  });

  describe("/api/articles?...", () => {
    describe("sort_by=...", () => {
      test("200: date : Should sort by date of creation descending, this should be the defualt sorting.", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
          });
      });
      test("200: votes : Should sort by the number of votes descending", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "votes",
              descending: true,
            });
          });
      });
      test("200: title : Should sort by the title of the article", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "title",
              descending: true,
            });
          });
      });
      test("200: author : Should sort by the autor of the article", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "author",
              descending: true,
            });
          });
      });
      test("200: topic : Should sort by the topic of the topic of the article", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "topic",
              descending: true,
            });
          });
      });
      test("404: Should respond with 404 error when sort_by does not exist", () => {
        return request(app)
          .get("/api/articles?sort_by=iDontExist")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Cannot sort by iDontExist");
          });
      });
      test("400: Should respond with 400 error when query is invalid", () => {
        return request(app)
          .get("/api/articles?sort=created_at")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });
    describe("order=", () => {
      test("200: asc : Should sort in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "votes",
              descending: false,
            });
          });
      });
      test("200: desc : Should sort in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=desc")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSorted({
              key: "votes",
              descending: true,
            });
          });
      });
      test("400: Should repsond with 400 error when order is anything other than asc or desc", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=most")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });

    describe("topic=", () => {
      test("200: Should respong with array of articles for the given topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((response) => {
            expect(response.body.articles.length).toBe(1);
            expect(response.body.articles[0]).toEqual(
              expect.objectContaining({
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 0,
                article_id: 5,
              })
            );
          });
      });
      test("200: Should return an empty array when topic exists, but there are no articles associated", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((response) => {
            expect(response.body.articles.length).toBe(0);
            expect(response.body.articles).toEqual([]);
          });
      });
      test("404: Should return 404 error when topic does not exists ", () => {
        return request(app)
          .get("/api/articles?topic=iDontExist")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Page Not Found");
          });
      });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("200: Should respond with an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.comments)).toBe(true);
            expect(response.body.comments.length).toBe(11);
            response.body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("200: Should respond with an empty array should a valid article_id have no comments associated", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toEqual([]);
          });
      });
      test("404: Should respond with 404 error when given article_id that does not yet exsist", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Page Not Found");
          });
      });
      test("400: Should respond with 400 error when given article_id is invalid", () => {
        return request(app)
          .get("/api/articles/one/comments")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });
    describe("POST", () => {
      test("POST: 201, Post a comment to specied article with, request being a username and a body, returning the posted comment", () => {
        const newComment = {
          username: "butter_bridge",
          body: "Relatable content!",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(201)
          .then((response) => {
            expect(response.body.comment).toEqual(
              expect.objectContaining({
                article_id: 1,
                author: "butter_bridge",
                body: "Relatable content!",
                comment_id: 19,
                created_at: expect.any(String),
                votes: 0,
              })
            );
          });
      });
      test("POST: 404 , Responds with a custom 404 error when user is not loged in or registed when trying to comment", () => {
        const newComment = { username: "jjcrl", body: "Relatable content!" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Please login or signup");
          });
      });
    });
  });

  describe("comment count for -> /api/articles & /api/articles/:artile_id", () => {
    test("200: Should include a comment_count for the number of all associated comments", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });

    test('200: GET request for articles should now include a comment_count for the number of all associated comments"', () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            author: "butter_bridge",
            body: "I find this existence challenging",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: "11",
          });
        });
    });
    test("200: should still include a comment count with a value of 0 when an aricle has no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              comment_count: "0",
            })
          );
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("204: Should delete the comment by given comment_id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("400: Should respond with 400 error when passed invalid comment_id ", () => {
        return request(app)
          .delete("/api/comments/one")
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Input");
          });
      });
    });
  });
});
