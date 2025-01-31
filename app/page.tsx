import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/buttons"

export default function LandingPage() {
  return (
      <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div
            className="w-[70vw] h-[70vh] flex items-center justify-center text-center space-y-8 p-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl mx-4">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-down">Welcome to QuizMaster</h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-up">
              Challenge yourself with our exciting quizzes and test your knowledge across various topics.
            </p>
            
            <Button
                asChild
                className="px-6 py-6 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/quiz" className="inline-flex items-center">
                Start Quiz
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-purple-400">Multiple Topics</h3>
                <p>From science to pop culture, we've got it all covered.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-purple-400">Adaptive Difficulty</h3>
                <p>Questions adjust to your skill level for an optimal challenge.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-purple-400">Track Progress</h3>
                <p>Monitor your improvement and compete with friends.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

