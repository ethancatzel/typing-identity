"use server";

import { db } from "@/db";
import { Leaderboard, NewRawData, leaderboard, raw_data } from "@/db/schema";
import { and, asc, eq, lt, sql } from "drizzle-orm";

const PASSAGES = [
  "Who washes the windows by Harold the fox.",
  "The quick brown fox washes the dishes and stares out Wendy's window.",
  "Humpdy Dumpty washes windows and jumps over the wall.",
  "Windows by the sea shore require regular washes to see out.",
];

export const getRandomPassage = () => {
  return PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
};

export type TypingDistance = {
  firstName: string;
  milliseconds: number;
};

// Saves raw keystroke data to the database, and updates the leaderboard.
export const saveData = async (newData: NewRawData[]): Promise<void> => {
  if (newData.length === 0) return;

  const records = await db.insert(raw_data).values(newData).returning();
  // We expect that all the new records are for the same user, and therefore getting any record for
  // the first_name would suffice. We do need the first record for the timestamp, because we need
  // to get the previous record for the same user (for calculating diffs).
  const { first_name, timestamp } = records[0];

  const prevRecord = await db
    .select()
    .from(raw_data)
    .where(
      and(
        eq(raw_data.first_name, first_name),
        lt(raw_data.timestamp, timestamp)
      )
    )
    .orderBy(asc(raw_data.timestamp))
    .limit(1);

  if (prevRecord.length === 1) {
    records.unshift(prevRecord[0]);
  }

  let count = newData.length;
  // The "total" in the leaderboard is the time diff between each keystroke.
  let total = 0;
  for (let i = 0; i < records.length - 1; i++) {
    const diff =
      (records[i + 1].timestamp as unknown as Date).valueOf() -
      (records[i].timestamp as unknown as Date).valueOf();

    // Ignore any adjacent typing that occurs > 5s apart. Assume the user wasn't focused on typing.
    if (diff > 5000) {
      count -= 1;
      continue;
    }

    total += diff;
  }

  // Perform a create or update operation on the leaderboard record.
  const rank = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.first_name, first_name));
  if (rank.length === 0) {
    await db.insert(leaderboard).values({ first_name, total, count });
  } else {
    await db
      .update(leaderboard)
      .set({ total: rank[0].total + total, count: rank[0].count + count })
      .where(eq(leaderboard.first_name, first_name));
  }
};

// Gets a list of users sorted by their score compared to the current users score.
export const getLeaderboard = async (
  firstName: string
): Promise<TypingDistance[]> => {
  const userData = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.first_name, firstName));
  if (userData.length === 0) return [];

  // We minus 1 to the count because the total is the sum of all the diffs (thus we're always
  // missing one).
  const curUserScore = userData[0].total / (userData[0].count - 1);

  // We get the top 5 users with better scores, and the top 5 users with worse scores.
  const better = (await db.execute(
    sql`select *
        from ${leaderboard}
        where ${leaderboard.total}::float / (${leaderboard.count} - 1) < ${curUserScore}
        LIMIT 5`
  )) as Leaderboard[];
  const worst = (await db.execute(
    sql`select *
        from ${leaderboard}
        where ${leaderboard.first_name} != ${userData[0].first_name}
          and ${leaderboard.total}::float / (${leaderboard.count} - 1) >= ${curUserScore}
        LIMIT 5`
  )) as Leaderboard[];

  return [...better, userData[0], ...worst]
    .map((obj) => ({
      firstName: obj.first_name,
      milliseconds: Math.abs(
        Math.round(curUserScore - obj.total / (obj.count - 1))
      ),
    }))
    .sort((a, b) => a.milliseconds - b.milliseconds);
};
