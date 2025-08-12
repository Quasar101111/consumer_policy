// src/__tests__/alias.test.ts
import * as api from "@/services/api";

test("API module loads correctly", () => {
  expect(api).toBeDefined();
});

// test-style-mock.test.ts
import styles from "@/styles/globals.css"; // This should resolve to your mock

test("CSS mock is loaded", () => {
  expect(styles).toBeDefined();         // ✅ should not be undefined
  expect(typeof styles).toBe("object"); // ✅ should be an empty object {}
});
