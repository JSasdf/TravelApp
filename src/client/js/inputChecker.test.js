import { inputCheck } from "./inputChecker.js";

describe("input", function() {
  it("should be a string", function() {
    const text = /^[a-zA-Z\s]{0,255}$/;
    const textTest = "1234";
    expect(text.test(textTest)).toBe(false);
  });
});
