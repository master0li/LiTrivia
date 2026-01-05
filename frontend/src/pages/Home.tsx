import { useEffect, useState, useRef } from "react";
import he from "he";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};


export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  const didFetch = useRef(false);

  useEffect(() => {
    // React StrictMode in dev may mount/unmount/mount components which
    // can cause effects to run twice; guard so we only fetch once.
    if (didFetch.current) return;
    didFetch.current = true;

    fetch("/api/questions")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setQuestion(data))
      .catch((err) => setError(String(err)));
  }, []);

  

    return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black text-white p-6 box-border">
      <div className="w-full mx-auto text-center px-6">

        <section className="mt-6">
          {error && <div className="text-yellow-300">Error: {error}</div>}
          {!question && !error && (
            <div className="text-gray-400" style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}>
              Loading...
            </div>
          )}

          {question && (
            <div
              className="p-8 rounded-md mt-6 whitespace-normal"
              style={{ fontSize: 'clamp(3rem, 6vw, 20rem)', width: '100%' }}
            >
              <div className="font-medium mb-3">{he.decode(question?.question ?? "")}</div>
              <div className="text-base text-gray-300">Answer: {he.decode(question?.correct_answer ?? "")}</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
