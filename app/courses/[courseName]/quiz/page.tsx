"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Question = {
  id: number;
  documentId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  order: number | null;
  quiz?: {
    id: number;
    documentId: string;
    title: string;
  };
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  const courseName = decodeURIComponent(
    String(params.courseName || "")
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://learnhub-backend-production-2413.up.railway.app/api/quiz-questions?populate=quiz&pagination[pageSize]=100",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quiz questions");
        }

        const result = await response.json();

        const allQuestions: Question[] = result.data || [];

        const normalizedCourse = courseName
          .toLowerCase()
          .replace(/-/g, " ")
          .trim();

        const filteredQuestions = allQuestions.filter((item) => {
          const quizTitle =
            item.quiz?.title?.toLowerCase().trim() || "";

          const quizName = quizTitle
            .replace(/\s+quiz\s*$/i, "")
            .trim();

          return (
            quizName === normalizedCourse ||
            quizTitle === `${normalizedCourse} quiz` ||
            quizTitle.includes(normalizedCourse) ||
            normalizedCourse.includes(quizName)
          );
        });

        if (filteredQuestions.length === 0) {
          setError(
            `No quiz questions found for "${courseName}".`
          );
          return;
        }

        filteredQuestions.sort((a, b) => {
          if (a.order === null) return 1;
          if (b.order === null) return -1;
          return (a.order ?? 0) - (b.order ?? 0);
        });

        setQuestions(filteredQuestions);
      } catch (err) {
        console.error(err);
        setError("Unable to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [courseName]);

  function selectAnswer(answer: string) {
    if (!questions[currentQuestion]) return;

    setAnswers((previous) => ({
      ...previous,
      [questions[currentQuestion].id]: answer,
    }));
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  }

  function submitQuiz() {
    let totalCorrect = 0;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (
        userAnswer?.trim().toLowerCase() ===
        question.correctAnswer?.trim().toLowerCase()
      ) {
        totalCorrect++;
      }
    });

    setScore(totalCorrect);
  }

  function goToCertificate() {
    const certificateUrl = `/certificate/${encodeURIComponent(
      courseName
    )}`;

    router.push(certificateUrl);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🧠</div>

          <h1 className="text-2xl font-bold">
            Loading Quiz...
          </h1>

          <p className="text-slate-400 mt-2">
            Preparing your questions
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
        <div className="max-w-lg w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">❌</div>

          <h1 className="text-2xl font-bold mb-3">
            Unable to Load Quiz
          </h1>

          <p className="text-slate-400">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  if (score !== null) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const passed = percentage >= 60;

    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-10 text-center shadow-2xl">

          <div className="text-6xl mb-5">
            {passed ? "🏆" : "📚"}
          </div>

          <h1 className="text-4xl font-bold mb-3">
            {passed
              ? "Congratulations!"
              : "Keep Learning!"}
          </h1>

          <p className="text-slate-400 mb-8">
            You completed the {courseName} quiz.
          </p>

          <div className="text-6xl font-extrabold mb-3">
            {percentage}%
          </div>

          <p className="text-lg text-slate-300">
            You scored{" "}
            <strong>
              {score} / {questions.length}
            </strong>
          </p>

          {passed ? (
            <div className="mt-8">
              <p className="text-green-400 font-semibold mb-6">
                ✅ You passed the quiz!
              </p>

              <button
                onClick={goToCertificate}
                className="w-full px-7 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg"
              >
                🏆 Generate Certificate
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-orange-400 font-semibold">
                ❌ You need 60% to pass.
              </p>

              <p className="text-slate-400 mt-2">
                Keep practicing and try again!
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setScore(null);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="mt-8 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Retake Quiz
          </button>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];

  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  const selectedAnswer = answers[question.id];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-4xl mx-auto">

        <div className="mb-10">

          <p className="text-blue-400 font-semibold mb-2">
            COURSE QUIZ
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Test Your Knowledge 🧠
          </h1>

          <p className="text-slate-400 mt-3">
            {question.quiz?.title ||
              `${courseName} Quiz`}
          </p>

        </div>

        <div className="mb-8">

          <div className="flex justify-between text-sm text-slate-400 mb-2">

            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {Math.round(
                ((currentQuestion + 1) /
                  questions.length) *
                  100
              )}
              %
            </span>

          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 md:p-10 shadow-xl">

          <div className="flex items-start gap-4 mb-8">

            <div className="min-w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
              {currentQuestion + 1}
            </div>

            <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
              {question.question}
            </h2>

          </div>

          <div className="space-y-4">

            {options.map((option, index) => {

              const letter =
                ["A", "B", "C", "D"][index];

              const isSelected =
                selectedAnswer === option;

              return (
                <button
                  key={index}
                  onClick={() =>
                    selectAnswer(option)
                  }
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                    isSelected
                      ? "border-blue-500 bg-blue-600/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800"
                  }`}
                >

                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isSelected
                        ? "bg-blue-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {letter}
                  </span>

                  <span className="text-slate-200">
                    {option}
                  </span>

                </button>
              );
            })}

          </div>

          <div className="flex justify-between items-center mt-10">

            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentQuestion ===
            questions.length - 1 ? (

              <button
                onClick={submitQuiz}
                disabled={!selectedAnswer}
                className="px-7 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                Submit Quiz ✓
              </button>

            ) : (

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                Next →
              </button>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}