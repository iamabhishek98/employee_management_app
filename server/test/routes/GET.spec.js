const request = require("supertest");
const server = require("../../server.js");
const Employee = require("../../db/models/employee");
const employees = require("../test_data");

describe("GET", () => {
  beforeAll(async () => {
    await Employee.destroy({ truncate: true });
    await Employee.bulkCreate(employees);
  });

  afterAll(async () => {
    await Employee.destroy({ truncate: true });
  });

  describe("/users", () => {
    describe("valid min and max salary", () => {
      it("should respond with all users", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees,
          },
        });
      });

      it("should respond with users within expected range", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=1000&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 3,
            rows: employees.slice(0, 3),
          },
        });
      });
    });

    describe("valid offset", () => {
      it("should respond with all users when offset = 0", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees,
          },
        });
      });

      it("should respond with expected users when offset > 0", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=2&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees.slice(2),
          },
        });
      });
    });

    describe("valid limit", () => {
      it("should respond with all users when limit = 5", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees,
          },
        });
      });

      it("should respond with expected users when limit = 2", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=2&sort=+id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees.slice(0, 2),
          },
        });
      });
    });

    describe("valid sort", () => {
      it("should respond with users sorted with id in descending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=-id"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees.slice().reverse(),
          },
        });
      });

      it("should respond with users sorted with login in ascending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+login"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: [
              employees[1],
              employees[4],
              employees[2],
              employees[3],
              employees[0],
            ],
          },
        });
      });

      it("should respond with users sorted with login in descending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=-login"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: [
              employees[0],
              employees[3],
              employees[2],
              employees[4],
              employees[1],
            ],
          },
        });
      });

      it("should respond with users sorted with name in ascending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+name"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: [
              employees[1],
              employees[4],
              employees[2],
              employees[3],
              employees[0],
            ],
          },
        });
      });

      it("should respond with users sorted with name in descending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=-name"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: [
              employees[0],
              employees[3],
              employees[2],
              employees[4],
              employees[1],
            ],
          },
        });
      });

      it("should respond with users sorted with salary in ascending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+salary"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees,
          },
        });
      });

      it("should respond with users sorted with salary in descending order", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=-salary"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: {
            count: 5,
            rows: employees.slice().reverse(),
          },
        });
      });
    });

    describe("invalid min and max salary", () => {
      it("should throw error when min > max salary", async () => {
        const res = await request(server).get(
          "/users?minSalary=10000&maxSalary=100&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid salary range values!",
        });
      });

      it("should throw error when salary < 0", async () => {
        const res = await request(server).get(
          "/users?minSalary=-1&maxSalary=100&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid salary range values!",
        });
      });

      it("should throw error when salary is not a number", async () => {
        const res = await request(server).get(
          "/users?minSalary=test&maxSalary=100&offset=0&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid salary range values!",
        });
      });

      it("should throw error when salary is missing", async () => {
        const res = await request(server).get(
          "/users?offset=0&limit=30&sort=+login"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Missing required request params!" });
      });
    });

    describe("invalid offset", () => {
      it("should throw error when offset < 0", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=-2&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid offset value!",
        });
      });

      it("should throw error when offset is not a number", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=test&limit=30&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid offset value!",
        });
      });

      it("should throw error when offset is missing", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&limit=30&sort=+login"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Missing required request params!" });
      });
    });

    describe("invalid limit", () => {
      it("should throw error when limit > 30", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=31&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid limit value!",
        });
      });

      it("should throw error when limit < 0", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=-1&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid limit value!",
        });
      });

      it("should throw error when limit is not a number", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=test&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid limit value!",
        });
      });

      it("should throw error when limit is missing", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&sort=+id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Missing required request params!" });
      });
    });

    describe("invalid sort", () => {
      it("should throw error when sort sign is invalid", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=?id"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid sort params!",
        });
      });

      it("should throw error when sort type is invalid", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30&sort=+email"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Invalid sort params!",
        });
      });

      it("should throw error when sort is missing", async () => {
        const res = await request(server).get(
          "/users?minSalary=0&maxSalary=100000&offset=0&limit=30"
        );

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Missing required request params!" });
      });
    });
  });

  describe("/users/${id}", () => {
    describe("valid id", () => {
      it("should respond with expected user", async () => {
        const res = await request(server).get(`/users/${employees[0].id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: employees[0],
        });
      });
    });

    describe("invalid id", () => {
      it("should throw error when user cannot be found", async () => {
        const res = await request(server).get(`/users/random`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Employee not found!",
        });
      });
    });
  });
});
