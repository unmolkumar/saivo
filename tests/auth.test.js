const app = require("../src/app.js");
const request = require("supertest");
const mongoose = require("mongoose");
const userModel = require("../src/models/user.model.js");
require("dotenv").config();

describe("auth routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });
  beforeEach(async () => {
    await userModel.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        email: "unmolkumar.login@gmail.com",
        password: "1234567890",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("user created successfully");
    });

    test("should reject duplicate user", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        email: "unmolkumar.login@gmail.com",
        password: "1234567890",
      });
      const response = await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        email: "unmolkumar.login@gmail.com",
        password: "1234567890",
      });
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        "user with this username/email already registered",
      );
    });
  });
});
