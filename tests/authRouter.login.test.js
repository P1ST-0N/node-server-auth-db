import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

import "dotenv/config";

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST);
  });

  afterAll(async () => {
    await mongoose.disconnect(process.env.DB_HOST);
  });

  it("response has a status code 200", async () => {
    const res = await supertest(app).post("/users/login").send({
      email: "12345@qwe.com",
      password: "12345",
    });

    expect(res.statusCode).toBe(200);
  });

  it("response has a token", async () => {
    const res = await supertest(app).post("/users/login").send({
      email: "12345@qwe.com",
      password: "12345",
    });

    expect(res.body.token).toBeDefined();
  });

  it("response has a user object with email and subscription fields type string", async () => {
    const res = await supertest(app).post("/users/login").send({
      email: "12345@qwe.com",
      password: "12345",
    });

    expect(typeof res.body.user.email).toBe("string");
    expect(typeof res.body.user.subscription).toBe("string");
  });
});
