"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  TypingDistance,
  getRandomPassage,
  saveDataAndGetLeaderboard,
} from "./actions";

type Props = {
  setResults: React.Dispatch<React.SetStateAction<TypingDistance[]>>;
};

const Form: React.FC<Props> = ({ setResults }) => {
  const [passage, setPassage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [typedPassage, setTypedPassage] = useState<string>("");

  useEffect(() => {
    const randomPassage = getRandomPassage();
    setPassage(randomPassage);
  }, []);

  return (
    <form className="flex flex-col px-8 space-y-8">
      <div className="flex flex-col space-y-3">
        <p className="text-lg font-medium">1. What&apos;s your name</p>

        <label className="flex flex-col">
          <input
            type="text"
            placeholder="Your Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-2 py-1 bg-gray-100 rounded outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <p className="text-lg font-medium">2. Type out the following passage</p>

        <div className="flex space-x-4">
          <p className="flex-1 py-2 font-mono text-center border-y bg-[#FDF1E8]">
            {passage.length === 0 ? "Loading..." : passage}
          </p>

          <button
            onClick={(e) => {
              e.preventDefault();

              setTypedPassage("");
              setPassage("");
              const randomPassage = getRandomPassage();
              setPassage(randomPassage);
            }}
            className="hover:text-[#E6712F]"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <label className="flex flex-col">
          <textarea
            placeholder="Passage"
            onChange={(e) => {
              if (firstName.trim().length > 0) {
                setTypedPassage(e.target.value);
              } else {
                toast.error("Please enter your name");
              }
            }}
            onKeyDown={(e) => {
              if (firstName.trim().length > 0) {
                saveDataAndGetLeaderboard({
                  first_name: firstName,
                  char: e.key,
                  timestamp: new Date().toISOString(),
                }).then((results) => {
                  setResults(results);
                });
              }
            }}
            value={typedPassage}
            className="px-2 py-1 bg-gray-100 rounded outline-none resize-none disabled:opacity-40"
          />
        </label>
      </div>

      <p className="text-sm italic text-gray-400">
        Results will show when you start typing.
      </p>
    </form>
  );
};

export default Form;
