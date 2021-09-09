const request = require("supertest");
const server = require("../../server.js");
const Employee = require("../../db/models/employee");
const employees = require("../test_data");

describe("POST", () => {
  beforeEach(async () => {
    await Employee.destroy({ truncate: true });
    await Employee.bulkCreate(employees);
  });

  afterAll(async () => {
    await Employee.destroy({ truncate: true });
  });

  describe("/users", () => {
    describe("valid body", () => {
      it("should create a new user", async () => {
        const newUser = {
          id: "e00010",
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
      it("should throw error when id is not unique", async () => {
        const invalidUser = {
          id: "e0001",
          login: "logan@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).post("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee could not be created!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when login is not unique", async () => {
        const invalidUser = {
          id: "e00010",
          login: "andy@xyz.com",
          name: "Logan",
          salary: 4320,
        };
        const res = await request(server).post("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Employee could not be created!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when salary is invalid", async () => {
        const invalidUser = {
          id: "e00010",
          login: "logan@xyz.com",
          name: "Logan",
          salary: -4320,
        };
        const res = await request(server).post("/users").send(invalidUser);

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
        const res = await request(server).post("/users").send(invalidUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Invalid body!" });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });
    });
  });

  describe("/users/upload", () => {
    describe("valid file", () => {
      it("should create new users", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/new.csv");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: "Successfully created/updated employees!",
        });

        const savedUsers = await Employee.findAll({
          order: [["id", "ASC"]],
          raw: true,
        });

        expect(savedUsers).toEqual([
          ...employees,
          {
            id: "e00051",
            login: "harry@xyz.com",
            name: "Harry Potter",
            salary: 1234,
          },
          {
            id: "e00052",
            login: "ron@xyz.com",
            name: "Ron Weasley",
            salary: 19234.5,
          },
        ]);
      });

      it("should create and update new users", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/update.csv");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          results: "Successfully created/updated employees!",
        });

        const savedUsers = await Employee.findAll({
          order: [["id", "ASC"]],
          raw: true,
        });

        expect(savedUsers).toEqual([
          {
            id: "e0001",
            login: "harry@xyz.com",
            name: "Harry Potter",
            salary: 1234,
          },
          {
            id: "e00012",
            login: "ron@xyz.com",
            name: "Ron Weasley",
            salary: 19234.5,
          },
          ...employees.slice(-4),
        ]);
      });
    });

    describe("invalid file", () => {
      it("should throw error when login is not unique", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/invalid_login.csv");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Employees could not be created/updated!",
        });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when file is not CSV", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/new.txt");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Please upload a CSV file!",
        });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when file is empty", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/empty.csv");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Please make sure CSV file is not empty!",
        });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when file contains incorrect column values", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/invalid.csv");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Please check if rows have the correct number of columns!",
        });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });

      it("should throw error when file contains invalid salary values", async () => {
        const res = await request(server)
          .post("/users/upload")
          .attach("file", "./test/files/invalid_salary.csv");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error:
            "Please make sure value entered for salary is properly formatted and valid!",
        });

        const savedUsers = await Employee.findAll({ raw: true });
        expect(savedUsers).toEqual(employees);
      });
    });
  });
});
