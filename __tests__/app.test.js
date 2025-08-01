const request = require("supertest");
const app = require("../app");

describe("App basic routes", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should have  /api/blogs, /api/comments/:blogId routes", async () => {
    const routes = ["/api/blogs", "/api/comments/:blogId" ];
    for (const route of routes) {
      const res = await request(app).get(route);
      // Should not be 404 (could be 401, 403, 200, etc.)
      expect(res.statusCode).not.toBe(404);
    }
  });
});
