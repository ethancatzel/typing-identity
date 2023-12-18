"use server";

import { db } from "@/db";
import { NewRawData, RawData, raw_data } from "@/db/schema";

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

export const saveDataAndGetLeaderboard = async (
  newData: NewRawData
): Promise<TypingDistance[]> => {
  await db.insert(raw_data).values(newData);
  const { first_name: firstName } = newData;

  const data = await db.select().from(raw_data).orderBy(raw_data.timestamp);

  const userToData = new Map<string, RawData[]>();
  data.forEach((row) => {
    if (userToData.get(row.first_name) === undefined) {
      userToData.set(row.first_name, [row]);
    } else {
      userToData.get(row.first_name)!.push(row);
    }
  });

  const userToAvgTyping = new Map<string, number>();
  Array.from(userToData.keys()).forEach((user) => {
    const items = userToData.get(user)!;

    let total = 0;
    let count = 0;
    for (let i = 0; i < items.length - 1; i++) {
      const diff =
        (items[i + 1].timestamp as unknown as Date).valueOf() -
        (items[i].timestamp as unknown as Date).valueOf();

      // Ignore any adjacent typing that occurs > 5s apart. Assume the user wasn't focused on typing.
      if (diff > 5000) {
        continue;
      }

      total += diff;
      count += 1;
    }

    userToAvgTyping.set(user, total / count);
  });

  const curUserAvgTyping = userToAvgTyping.get(firstName) ?? 0;
  return Array.from(userToAvgTyping.entries())
    .map((obj) => ({
      firstName: obj[0] === firstName ? `(You) ${obj[0]}` : obj[0],
      milliseconds: Math.abs(Math.round(curUserAvgTyping - obj[1])),
    }))
    .sort((a, b) => a.milliseconds - b.milliseconds);
};
