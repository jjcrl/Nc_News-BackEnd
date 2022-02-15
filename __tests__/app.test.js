const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("ENDPOINT TESTING", () => {
  describe("/api/topics", () => {
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
          expect(response.body.msg).toBe("Page Not Found, Invalid path");
        });
    });
  });
  describe("/api/articles", () => {
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
  describe("/api/users", () => {
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
  describe("/api/articles/:article_id", () => {
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
          expect(response.body.msg).toBe("No article found for article_id 100");
        });
    });
    test("400: Should respond with 400 when passed invalid query", () => {
      return request(app)
        .get("/api/articles/twelve")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid input");
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
      test("400: Should respond with 400 error when given ivalid sort_by option", () => {
        return request(app)
          .get("/api/articles?sort_by=age")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Cannot sort by age");
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
              key:"votes",
              descending: true,
            });
          });
      });
      test("400: Should repsond with 400 error when order is anything other than asc or desc", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=most")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid input");
          });
      });
    });
    describe("topic=", () => {
      test("200: Should allow for querying of specific topics", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((response) => {
            expect(response.body.articles.length).toBe(1);
            expect(response.body.articles[0]).toEqual({
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              article_id: 5,
            });
          });
      });

      test("200: Should return an empty array when there are no articles for given topic", () => {
        return request(app)
          .get("/api/articles?topic=dogs")
          .expect(200)
          .then((response) => {
            expect(response.body.articles.length).toBe(0);
            expect(response.body.articles).toEqual([]);
          });
      });
    });
  });
});
