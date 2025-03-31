import { generate } from "random-words";
import { useEffect, useState } from "react";
import CompareCard from "../CompareCard/CompareCard";
import LineFlickerAnimation from "../LineFlickerAnimation/LineFlickerAnimation";
import LinePulseAnimation from "../LinePulseAnimation/LinePulseAnimation";
import "./Words.scss";

export default function Words({ showWordButtons, wordsFinalized }) {
  const [words, setWords] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // start fetching immediately
  const [isStopped, setIsStopped] = useState(false);

  function fetchWords() {
    const words = generate({ exactly: 2 });
    setWords(words);
  }

  useEffect(() => {
    fetchWords(); // fetch immediately on load

    if (isFetching) {
      const interval = setInterval(fetchWords, 100); // fetch every 100ms
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsFetching(false);
        setIsStopped(true); // mark that fetching has stopped
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isFetching]);

  const stopFetching = () => {
    setIsFetching(false);
    setIsStopped(true); // make sure ui updates for manual stop, same as auto stop
  };

  return (
    <>
      {!wordsFinalized && words.length !== 0 && <LineFlickerAnimation />}
      {wordsFinalized && <LinePulseAnimation />}
      {showWordButtons && (
        <div className="words">
          <CompareCard word={words[0]} />
          {!wordsFinalized && (
            <div className="buttons">
              {isFetching && <button onClick={stopFetching}>■</button>}
              {!isFetching && isStopped && (
                <>
                  <button
                    onClick={() => {
                      setIsFetching(true);
                      setIsStopped(false);
                    }}
                  >
                    ♻
                  </button>
                </>
              )}
            </div>
          )}
          <CompareCard word={words[1]} />
        </div>
      )}
    </>
  );
}
