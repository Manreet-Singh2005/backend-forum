import request from "supertest";
import app from "../app";

let token: string;
let otherUserToken: string;
let postId: string;
let commentId: string;

describe("Comment API", () => {

  beforeAll(async () => {
    // USER 1 (OWNER)
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
        title: "Test Post",
        content: "Test Content"
      });

    postId = post.body._id;

    // CREATE COMMENT
    const comment = await request(app)
      .post(`/api/comments/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Nice post" });

    commentId = comment.body._id;
  });

  // FAIL: COMMENT NOT FOUND
  it("should return 404 if comment not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .put(`/api/comments/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Test" });

    expect(res.statusCode).toBe(404);
  });

});