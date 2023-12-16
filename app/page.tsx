"use client";

import { useState } from "react";
import Form from "./Form";
import Leaderboard from "./Leaderboard";
import { TypingDistance } from "./actions";

export default function Home() {
  const [results, setResults] = useState<TypingDistance[]>([]);

  return (
    <div className="grid w-screen h-screen grid-cols-2 py-8 text-center">
      <div className="border-r">
        <h1 className="text-3xl font-semibold">
          Create an identity. Let&apos;s{" "}
          <span className="border-b-4 border-[#E6712F]">type</span>!
        </h1>

        <hr />
        <br />

        <Form setResults={setResults} />
      </div>

      <div className="">
        <h1 className="text-3xl font-semibold">Leaderboard</h1>

        <hr />
        <br />

        <Leaderboard results={results} />
      </div>
    </div>
  );
}
