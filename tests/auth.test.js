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

  describe("POST /login", () => {
    test("should login with correct credentials", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        password: "1234567890",
        email: "unmolkumar.login@gmail.com",
      });
      const response = await request(app).post("/api/auth/login").send({
        username: "unmolkumar",
        password: "1234567890",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("login successfull");
    });

    test("should not login with incorrect credentials", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        password: "1234567890",
        email: "unmolkumar.login@gmail.com",
      });
      const response = await request(app).post("/api/auth/login").send({
        username: "unmolkumar",
        password: "4823748234",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("invalid credentials");
    });

    test("should detect invalid user", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        password: "1234567890",
        email: "unmolkumar.login@gmail.com",
      });
      const response = await request(app).post("/api/auth/login").send({
        username: "anmolkumar",
        password: "1234567890",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("user does not exist");
    });

    test("should login with correct token", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        password: "1234567890",
        email: "unmolkumar.login@gmail.com",
      });
      const loginResponse = await request(app).post("/api/auth/login").send({
        username: "unmolkumar",
        password: "1234567890",
      });
      const cookie = loginResponse.headers["set-cookie"];
      const response = await request(app)
        .post("/api/auth/login")
        .set("Cookie", cookie)
        .send({
          username: "unmolkumar",
          password: "1234567890",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("login successfull");
    });

    test("should not login with incorrect token", async () => {
      await request(app).post("/api/auth/register").send({
        username: "unmolkumar",
        password: "1234567890",
        email: "unmolkumar.login@gmail.com",
      });
      const cookie = "token=fakeassfuckcookie";
      const response = await request(app)
        .post("/api/auth/login")
        .set("Cookie", cookie)
        .send({
          username: "unmolkumar",
          password: "1234567890",
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("invalid token");
    });
  });
});
