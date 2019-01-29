import Args from "../../src/Model/Args";

test("should help be shown", () => {
  const empty = {};
  const domain = { domain: "something.com" };
  const output = { output: "./" };
  const outputDomain = { output: "./", domain: "something.com" };

  expect(new Args(empty).shouldShowHelp()).toBeTruthy();
  expect(new Args(domain).shouldShowHelp()).toBeTruthy();
  expect(new Args(output).shouldShowHelp()).toBeTruthy();
  expect(new Args(outputDomain).shouldShowHelp()).toBeFalsy();
});
