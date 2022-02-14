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
          expect(response.body.msg).toBe("Invalid path");
        });
    });
  });
});
