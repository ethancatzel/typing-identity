"use client";

import { type NewRawData } from "@/db/schema";
import { debounce } from "lodash";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getLeaderboard,
  getRandomPassage,
  saveData,
  type TypingDistance,
} from "./actions";

type Props = {
  setResults: React.Dispatch<React.SetStateAction<TypingDistance[]>>;
};

const Form: React.FC<Props> = ({ setResults }) => {
  const [passage, setPassage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [typedPassage, setTypedPassage] = useState<string>("");
  const [localData, setLocalData] = useState<NewRawData[]>([]);

  useEffect(() => {
    const randomPassage = getRandomPassage();
    setPassage(randomPassage);
  }, []);

  const sendData = useCallback(
    (data: NewRawData[]) => {
      saveData(data)
        .then(() => getLeaderboard(firstName))
        .then(setResults);
      setLocalData([]);
    },
    [firstName, setResults]
  );

  const sendDataDebounce = useMemo(
    () => debounce((data) => sendData(data), 1500),
    [sendData]
  );

  useEffect(() => {
    // To minimise network requests, and maximise user experience, we send raw data to the server on
    // two conditions:
    // 1. The user has typed 15 characters.
    // 2. The user has stopped typing for 1.5 seconds.
    if (localData.length >= 15) {
      sendData(localData);
      sendDataDebounce.cancel();
      // Only debounce if the user has typed something.
    } else if (localData.length >= 1) {
      sendDataDebounce(localData);
    }
  }, [localData, sendData, sendDataDebounce]);

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
              // Only add to data if the user has entered their name.
              // This is checked in the onChange event above.
              if (firstName.trim().length > 0) {
                setLocalData((prev) => [
                  ...prev,
                  {
                    first_name: firstName,
                    char: e.key,
                    timestamp: new Date().toISOString(),
                  },
                ]);
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
