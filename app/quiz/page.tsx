"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/buttons";
import { ArrowLeft } from "lucide-react";

interface QuizOption {
  id: number;
  description: string;
  question_id: number;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
  unanswered: boolean;
  photo_url?: string | null;
}

interface QuizQuestion {
  description: string;
  options: QuizOption[];
  correctAnswer: string;
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch("/api/quiz");
        if (!response.ok) {
          throw new Error("Failed to load quiz data");
        }
        const data = await response.json();
        setQuizData(data.questions);
      } catch (err) {
        setError("Failed to load quiz data.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (quizData) {
      const currentQuestion = quizData[currentQuestionIndex];
      const correctOption = currentQuestion.options.find(
        (option) => option.is_correct
      );

      if (selectedAnswer === correctOption?.description) {
        setScore(score + 1);
      }

      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!quizData) return null;

  const scorePercentage = (score / (quizData.length || 1)) * 100;
  let progressBarColor = "bg-red-600";

  if (score > 3 && score < 8) {
    progressBarColor = "bg-yellow-600";
  } else if (score >= 8) {
    progressBarColor = "bg-green-600";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 custom-scrollbar">
      <div className="w-[90vw] h-[70vh] flex items-center justify-center text-center space-y-8 p-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl mx-4">
        <div>
          {!quizCompleted ? (
            <div>
              <h2 className="text-xl mb-2 text-white">
                Question {currentQuestionIndex + 1}/{quizData.length}
              </h2>
              <p className="mb-4 text-white">
                {quizData[currentQuestionIndex].description}
              </p>

              <div className="space-y-2">
                {quizData[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option.description)}
                    className={`block w-full p-2 border rounded ${
                      selectedAnswer === option.description
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {option.description}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="w-[5vw] mt-4 p-2 bg-green-500 text-white rounded disabled:bg-gray-300 mx-auto block"
              >
                {currentQuestionIndex < quizData.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl mb-2 text-white">Quiz Completed!</h2>
              <p className="text-white text-3xl">
                Your score: {score} out of {quizData.length}
              </p>
              <div className="w-[40vw] bg-gray-200 rounded-full dark:bg-gray-700 mt-4">
                <div
                  className={`progress-bar ${progressBarColor} text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`}
                  style={{ "--target-width": `${scorePercentage}%` }}
                >
                  {scorePercentage}%
                </div>
              </div>
              <Button
                asChild
                className="px-6 py-6 text-lg mt-10 font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Link href="/" className="inline-flex items-center">
                  <ArrowLeft className="ml-2 h-5 w-5" />
                  Back To Home
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes progressAnimation {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }
        .progress-bar {
          animation: progressAnimation 2s ease-out;
          width: var(--target-width);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
