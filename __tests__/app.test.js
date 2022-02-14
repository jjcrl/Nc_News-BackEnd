const req = require("express/lib/request");
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
    test("Should default to sorted by date descending order", () => {
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
              author: expect.any(String),
              body:expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
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
    test("400: Should respond with 400 when passed invalid query type", () => {
      return request(app)
        .get("/api/articles/twelve")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid input");
        });
    });

  });
});
