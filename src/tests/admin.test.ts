import request from "supertest";
import app from "../app";
import User from "../models/User";

let adminToken: string;
let userToken: string;

describe("Admin API", () => {

  beforeAll(async () => {
  // ADMIN
  const adminEmail = `admin${Date.now()}@mail.com`;

  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: adminEmail,
    password: "123456"
  });

  await User.findOneAndUpdate(
    { email: adminEmail },
    { role: "admin" }
  );

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: adminEmail,
    password: "123456"
  });

  adminToken = adminLogin.body.accessToken;

  // NORMAL USER
  const userEmail = `user${Date.now()}@mail.com`;

  await request(app).post("/api/auth/register").send({
    name: "User",
    email: userEmail,
    password: "123456"
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: userEmail,
    password: "123456"
  });

  userToken = userLogin.body.accessToken;
});

  it("should get stats", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should block normal user from admin route", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.statusCode).toBe(403);
});
});