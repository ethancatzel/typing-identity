"use server";

import { db } from "@/db";
import { NewRawData, RawData, raw_data } from "@/db/schema";

export const saveData = async (data: NewRawData) => {
  await db.insert(raw_data).values(data);
};

export type TypingDistance = {
  firstName: string;
  milliseconds: number;
};

export const getTypingDistance = async ({
  firstName,
}: {
  firstName: string;
}): Promise<TypingDistance[]> => {
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
  return (
    Array.from(userToAvgTyping.entries())
      .map((obj) => ({
        firstName: obj[0],
        milliseconds: Math.abs(Math.round(curUserAvgTyping - obj[1])),
      }))
      // .filter((obj) => obj.firstName !== firstName)
      .sort((a, b) => a.milliseconds - b.milliseconds)
  );
};
