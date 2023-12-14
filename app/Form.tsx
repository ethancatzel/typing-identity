"use client";

import { useState } from "react";
import { TypingDistance, saveData, getTypingDistance } from "./actions";
import { MoveDown } from "lucide-react";

const Form: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [results, setResults] = useState<TypingDistance[]>([]);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const results = await getTypingDistance({ firstName });
          setResults(results);
        }}
        className="flex flex-col space-y-2"
      >
        <label className="flex flex-col space-y-1">
          <input
            required
            type="text"
            placeholder="Your Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-2 py-1 bg-gray-100 rounded outline-none"
          />
        </label>

        <div className="flex space-x-2">
          <label className="flex flex-col flex-1 space-y-1">
            <textarea
              disabled={firstName.trim() === ""}
              placeholder="Passage"
              onKeyDown={(e) => {
                saveData({
                  first_name: firstName,
                  char: e.key,
                  timestamp: new Date().toISOString(),
                });
              }}
              className="px-2 py-1 bg-gray-100 rounded outline-none resize-none disabled:opacity-40"
            />
          </label>
          <button
            type="submit"
            className="px-2 py-1 font-medium bg-gray-100 border border-black rounded hover:bg-[#FDF1E8]"
          >
            Submit
          </button>
        </div>
      </form>

      <br />

      <div className="flex justify-center">
        <MoveDown size={32} />
      </div>

      <br />

      <ol className="flex flex-col items-center space-y-2 list-decimal">
        <h3 className="text-lg font-medium">
          {results.length == 0 ? (
            <>
              Find out who you{" "}
              <span className="border-b-2 border-[#E6712F]">type</span> like
            </>
          ) : (
            <>
              Your <span className="border-b-2 border-[#E6712F]">typing</span>{" "}
              is most similar to
            </>
          )}
        </h3>

        {results.map((item) => (
          <li key={item.firstName}>
            {item.firstName},{" "}
            <span className="font-bold">{item.milliseconds}ms</span>
          </li>
        ))}
      </ol>
    </>
  );
};

export default Form;
