const request = require("supertest");
const server = require("../../server.js");
const Employee = require("../../db/models/employee");
const employees = require("../test_data");

describe("DELETE", () => {
  beforeEach(async () => {
    await Employee.destroy({ truncate: true });
    await Employee.bulkCreate(employees);
  });

  afterAll(async () => {
    await Employee.destroy({ truncate: true });
  });

  describe("/users/${id}", () => {
    describe("valid id", () => {
      it("should delete the corresponding user", async () => {
        const res = await request(server).delete("/users/e0001");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ results: "Employee deleted!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees.slice(1));
      });
    });

    describe("invalid id", () => {
      it("should throw error when user cannot be found", async () => {
        const res = await request(server).delete("/users/e0006");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee not found!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });
    });
  });
});
