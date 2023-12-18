import { test, expect, describe, it } from "bun:test";
import { getLeaderboard } from "@/app/actions";

describe("Leaderboard", () => {
  test("Returns sorted list", () => {
    getLeaderboard("Ethan").then((scores) => {
      const isDescending = scores.every(
        (score, i) =>
          i === 0 || score.milliseconds >= scores[i - 1].milliseconds
      );
      expect(isDescending).toBeTrue();
    });
  });
});
