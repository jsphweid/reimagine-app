import { prettyPrintDuration } from "./utils";

describe("prettyPrintDuration", () => {
  test.each`
    duration | expected
    ${1}     | ${"0:01"}
    ${10}    | ${"0:10"}
    ${11}    | ${"0:11"}
    ${60}    | ${"1:00"}
    ${61}    | ${"1:01"}
    ${61.49} | ${"1:01"}
    ${61.5}  | ${"1:02"}
    ${600}   | ${"10:00"}
  `(
    "returns $expected when duration is $duration",
    ({ duration, expected }) => {
      expect(prettyPrintDuration(duration)).toEqual(expected);
    }
  );
});
