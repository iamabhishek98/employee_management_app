const request = require("supertest");
const server = require("../server.js");
const Employee = require("../db/models/Employee");
const { users } = require("./testData");

describe("POST", () => {
  beforeEach(async () => {
    await Employee.destroy({ truncate: true });
    await Employee.bulkCreate(users);
  });

  afterAll(async () => {
    await Employee.destroy({ truncate: true });
  });

  describe("/users", () => {
    describe("valid body", () => {
      it("should create a new user", async () => {
        const newUser = {
          id: "e0010",
          login: "logan@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).post("/users").send(newUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ results: "Employee created!" });

        const savedUser = await Employee.findOne({
          where: { id: newUser.id },
          raw: true,
        });
        expect(savedUser).toEqual(newUser);
      });
    });

    describe("invalid body", () => {
      it("should throw error when login is not unique", async () => {
        const invalidUser = {
          id: "e0010",
          login: "andy@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).post("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee could not be created!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(users);
      });
    });
  });
});
