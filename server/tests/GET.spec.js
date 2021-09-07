const request = require("supertest");
const server = require("../server.js");
const Employee = require("../db/models/Employee");

describe("GET /users", () => {
  beforeEach(async () => {
    await Employee.create({
      id: "e001",
      login: "abc@xyz.com",
      name: "Sandy",
      salary: 10000,
    });
  });

  beforeAll(async () => {
    await Employee.destroy({
      where: {},
      truncate: true,
    });
  });

  describe("given a username and password", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(server).get("/users/e001");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: {
          id: "e001",
          login: "abc@xyz.com",
          name: "Sandy",
          salary: 10000,
        },
      });
    });
  });
});
