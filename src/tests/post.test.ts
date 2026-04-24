import request from "supertest";
import app from "../app";

let token: string;
let otherUserToken: string;
let postId: string;

describe("Post API", () => {

  beforeAll(async () => {
  // USER 1
  const email1 = `user1${Date.now()}@mail.com`;

  await request(app).post("/api/auth/register").send({
    name: "User1",
    email: email1,
    password: "123456"
  });

  const login1 = await request(app).post("/api/auth/login").send({
    email: email1,
    password: "123456"
  });

  token = login1.body.accessToken;

  // USER 2 (OTHER USER)
  const email2 = `user2${Date.now()}@mail.com`;

  await request(app).post("/api/auth/register").send({
    name: "User2",
    email: email2,
    password: "123456"
  });

  const login2 = await request(app).post("/api/auth/login").send({
    email: email2,
    password: "123456"
  });

  otherUserToken = login2.body.accessToken;

  // CREATE POST
  const post = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Test",
      content: "Test"
    });

  postId = post.body._id;
});

  it("should create post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "Hello"
      });

    postId = res.body._id;

    expect(res.statusCode).toBe(201);
  });

  it("should get posts", async () => {
    const res = await request(app)
    .get("/api/posts")
    .set("Authorization", `Bearer ${token}`);


    expect(res.statusCode).toBe(200);
  });

  it("should fail create post without token", async () => {
  const res = await request(app)
    .post("/api/posts")
    .send({ title: "Test", content: "Test" });

  expect(res.statusCode).toBe(401);
});

it("should fail update post by other user", async () => {
  const res = await request(app)
    .put(`/api/posts/${postId}`)
    .set("Authorization", `Bearer ${otherUserToken}`)
    .send({ title: "Hack" });

  expect(res.statusCode).toBe(403);
});

it("should return 404 if post not found", async () => {
  const res = await request(app)
    .put("/api/posts/507f1f77bcf86cd799439011")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(404);
});
});