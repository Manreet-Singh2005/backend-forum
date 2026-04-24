import request from "supertest";
import app from "../app";

describe("Auth API", () => {

  it("should register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test",
        email: `test${Date.now()}@mail.com`,
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login user", async () => {
    const email = `test${Date.now()}@mail.com`;

    await request(app).post("/api/auth/register").send({
      name: "Test",
      email,
      password: "123456"
    });

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should fail if email already exists", async () => {
  const user = {
    name: "Test",
    email: "duplicate@test.com",
    password: "123456"
  };

  await request(app).post("/api/auth/register").send(user);

  const res = await request(app)
    .post("/api/auth/register")
    .send(user);

  expect(res.statusCode).toBe(400);
});

it("should fail login if user not found", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "notfound@test.com",
    password: "123456"
  });

  expect(res.statusCode).toBe(400);
});

});