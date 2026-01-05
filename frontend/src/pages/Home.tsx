import { useEffect, useState, useRef, type SetStateAction } from "react";
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
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        // React StrictMode in dev may mount/unmount/mount components which
        // can cause effects to run twice; guard so we only fetch once.
        if (didFetch.current) return;
        didFetch.current = true;

        fetchQuestion()
            .then((q) => {
                setQuestion(q);
                setShowAnswer(false);

            })
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
                        <div key={showAnswer ? 'answer' : 'question'}
                            className="p-8 rounded-md mt-6 whitespace-normal cursor-pointer select-none flex flex-col items-center justify-center"
                            role="button"
                            tabIndex={0}
                            aria-pressed={showAnswer}
                            onClick={() => {
                                if (showAnswer) {

                                    fetchQuestion().then((q) => {
                                        setQuestion(q);
                                        setShowAnswer(false);
                                    });

                                }
                                else {
                                    setShowAnswer((s) => !s);
                                }
                            }
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    if (showAnswer) {

                                        fetchQuestion().then((q) => {
                                            setQuestion(q);
                                            setShowAnswer(false);
                                        });

                                    }
                                    else {
                                        setShowAnswer((s) => !s);
                                    }
                                }
                            }}
                            style={{
                                width: '100%'
                            }}
                        >
                            <div
                                className="font-medium mb-3 text-center leading-tight"
                                style={{
                                    fontSize: showAnswer
                                        ? 'clamp(2rem, min(8vw, 16vh), 25rem)'
                                        : 'clamp(2rem, min(8vw, 16vh), 25rem)',
                                    lineHeight: 1,
                                }}
                            >
                                {!showAnswer ? he.decode(question?.question ?? "") : he.decode(question?.correct_answer ?? "")}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
async function fetchQuestion() {
    const res = await fetch('/api/questions');
    if (!res.ok) throw new Error(res.statusText);
    return res.json(); // Promise<Question>
}

