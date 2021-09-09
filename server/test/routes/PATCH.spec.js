const request = require("supertest");
const server = require("../../server.js");
const Employee = require("../../db/models/employee");
const employees = require("../test_data");

describe("PATCH", () => {
  beforeEach(async () => {
    await Employee.destroy({ truncate: true });
    await Employee.bulkCreate(employees);
  });

  afterAll(async () => {
    await Employee.destroy({ truncate: true });
  });

  describe("/users", () => {
    describe("valid body", () => {
      it("should update the corresponding user", async () => {
        const updatedUser = {
          id: "e0001",
          login: "logan@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).patch("/users").send(updatedUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ results: "Employee updated!" });

        const savedUser = await Employee.findOne({
          where: { id: updatedUser.id },
          raw: true,
        });
        expect(savedUser).toEqual(updatedUser);
      });
    });

    describe("invalid body", () => {
      it("should throw error when user does not exist", async () => {
        const invalidUser = {
          id: "e00010",
          login: "logan@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).patch("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee not found!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when login is not unique", async () => {
        const invalidUser = {
          id: "e0001",
          login: "andy@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).patch("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee could not be updated!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when salary is invalid", async () => {
        const invalidUser = {
          id: "e0001",
          login: "andy@xyz.com",
          name: "Logan",
          salary: -4320,
        };
        const res = await request(server).patch("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Invalid body!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when required body values are missing", async () => {
        const invalidUser = {
          login: "logan@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).patch("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Invalid body!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });
    });
  });
});
