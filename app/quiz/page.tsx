'use client';
import { useEffect, useState } from 'react';

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
    options: QuizOption[]; // Options are objects, not strings
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
                const response = await fetch('/api/quiz');
                if (!response.ok) {
                    throw new Error('Failed to load quiz data');
                }
                const data = await response.json();
                console.log("Fetched Quiz Data:", data); // Debugging
                setQuizData(data.questions); // Ensure this matches API response structure
            } catch (err) {
                setError('Failed to load quiz data.');
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
            const correctOption = currentQuestion.options.find(option => option.is_correct);

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

    // Fix 1: Prevent Hydration Mismatch by ensuring data is available before rendering
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!quizData) return null;
   console.log("Quiz Data:", quizData); // Debugging
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz</h1>
            {!quizCompleted ? (
                <div>
                    <h2 className="text-xl mb-2">
                        Question {currentQuestionIndex + 1}/{quizData.length}
                    </h2>
                    <p className="mb-4 text-white">{quizData[currentQuestionIndex].description}</p>

                    <div className="space-y-2 text-black">
                        {quizData[currentQuestionIndex].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option.description)}
                                className={`block w-full p-2 border rounded ${
                                    selectedAnswer === option.description ? 'bg-blue-500 text-white' : 'bg-white'
                                }`}
                            >
                                {option.description}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className="mt-4 p-2 bg-green-500 text-white rounded disabled:bg-gray-300 mx-auto block"
                    >
                        {currentQuestionIndex < quizData.length - 1 ? 'Next' : 'Finish'}
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl mb-2">Quiz Completed!</h2>
                    <p>Your score: {score} out of {quizData.length}</p>
                </div>
            )}
        </div>
    );
}
