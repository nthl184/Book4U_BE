import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";

afterAll(async () => mongoose.connection.close());

test("register + login", async () => {
  const email = `t${Date.now()}@t.com`;
  await request(app).post("/api/auth/register").send({ name: "t", email, password: "123456" }).expect(201);
  const res = await request(app).post("/api/auth/login").send({ email, password: "123456" }).expect(200);
  expect(res.body.token).toBeDefined();
});
