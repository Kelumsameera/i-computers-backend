import test from "node:test";
import assert from "node:assert/strict";
import { requireAdmin } from "../middleware/requireAdmin.js";

function invoke(user) {
  const req = { user };
  let statusCode = 200;
  let responseBody;
  let calledNext = false;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };
  requireAdmin(req, res, () => {
    calledNext = true;
  });
  return { statusCode, responseBody, calledNext };
}

test("unauthenticated requests are rejected", () => {
  const result = invoke(undefined);
  assert.equal(result.statusCode, 401);
  assert.equal(result.calledNext, false);
});

test("customers cannot access admin endpoints", () => {
  const result = invoke({ email: "customer@example.test", role: "customer" });
  assert.equal(result.statusCode, 403);
  assert.equal(result.calledNext, false);
});

test("admin JWT payload with email and role is accepted", () => {
  const result = invoke({ email: "admin@example.test", role: "admin" });
  assert.equal(result.calledNext, true);
  assert.equal(result.statusCode, 200);
});

test("admin role alone does not authenticate a request", () => {
  const result = invoke({ role: "admin" });
  assert.equal(result.statusCode, 401);
  assert.equal(result.calledNext, false);
});
