const sum = (a: number) => a + 5;

test("basic", () => {
  expect(sum(4)).toBe(9);
});

test("basic again", () => {
  expect(sum(1, 2)).toBe(3);
});
