import { useState, useEffect } from 'react'
import { quizzes } from './data/quizzes'
import { UserProgress, Theme } from './types'

const THEMES: Theme[] = ['LLM', 'Vision', 'Agent']
const STORAGE_KEY = 'ai-quiz-progress'

function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'score'>('home')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [userProgress, setUserProgress] = useState<UserProgress>({})
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setUserProgress(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress))
  }, [userProgress])

  const themeQuizzes = selectedTheme
    ? quizzes.filter((q) => q.theme === selectedTheme)
    : []

  const currentQuiz = themeQuizzes[currentQuizIndex]

  const handleAnswerClick = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)

    // Update progress
    if (currentQuiz) {
      const isCorrect = index === currentQuiz.correctAnswer
      const progress = userProgress[selectedTheme!] || {
        completedQuizzes: [],
        correctAnswers: 0,
        totalAttempts: 0,
        lastAttempt: new Date().toISOString(),
      }

      setUserProgress({
        ...userProgress,
        [selectedTheme!]: {
          ...progress,
          completedQuizzes: [...new Set([...progress.completedQuizzes, currentQuiz.id])],
          correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
          totalAttempts: progress.totalAttempts + 1,
          lastAttempt: new Date().toISOString(),
        },
      })
    }
  }

  const handleNextQuiz = () => {
    if (currentQuizIndex < themeQuizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setScreen('score')
    }
  }

  const handleStartTheme = (theme: Theme) => {
    setSelectedTheme(theme)
    setCurrentQuizIndex(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setScreen('quiz')
  }

  const handleBackToHome = () => {
    setScreen('home')
    setSelectedTheme(null)
    setCurrentQuizIndex(0)
  }

  const getTotalScore = () => {
    return Object.values(userProgress).reduce((sum, p) => sum + p.correctAnswers, 0)
  }

  // ========== Screen: Home ==========
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              AI Knowledge Quiz
            </h1>
            <p className="text-gray-600 text-lg">
              AI業界を学ぶゲーム。毎日のクイズで知識を深めよう！
            </p>
          </div>

          {/* Theme Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              テーマを選択
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {THEMES.map((theme) => {
                const progress = userProgress[theme]
                const score = progress?.correctAnswers ?? 0
                const total = progress?.totalAttempts ?? 0

                return (
                  <button
                    key={theme}
                    onClick={() => handleStartTheme(theme)}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left"
                  >
                    <div className="text-3xl mb-2">
                      {theme === 'LLM' && '🤖'}
                      {theme === 'Vision' && '👁️'}
                      {theme === 'Agent' && '⚙️'}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {theme}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {score}/{total} 正解
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Score Board */}
          {Object.keys(userProgress).length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 あなたのスコア
              </h2>
              <div className="space-y-4">
                {THEMES.map((theme) => {
                  const progress = userProgress[theme]
                  if (!progress) return null

                  const percentage =
                    progress.totalAttempts > 0
                      ? Math.round(
                          (progress.correctAnswers / progress.totalAttempts) * 100
                        )
                      : 0

                  return (
                    <div key={theme} className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{theme}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {progress.correctAnswers}/{progress.totalAttempts}
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-10">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-lg font-bold text-gray-900">
                  総合スコア: <span className="text-blue-600">{getTotalScore()}</span> 問
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ========== Screen: Quiz ==========
  if (screen === 'quiz' && currentQuiz) {
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-semibold">
                {selectedTheme} クイズ
              </span>
              <span className="text-gray-600">
                {currentQuizIndex + 1}/{themeQuizzes.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                style={{
                  width: `${((currentQuizIndex + 1) / themeQuizzes.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentQuiz.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isAnswered = answered

                let bgColor = 'bg-gray-100 hover:bg-gray-200'
                if (isAnswered) {
                  if (index === currentQuiz.correctAnswer) {
                    bgColor = 'bg-green-100 border-green-500'
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-100 border-red-500'
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition-all ${
                      isAnswered ? 'border-2' : 'border-gray-200'
                    } ${bgColor} disabled:cursor-default`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-800">{option}</span>
                      {isAnswered && index === currentQuiz.correctAnswer && (
                        <span className="ml-auto text-green-600 text-xl">✅</span>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600 text-xl">❌</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-blue-600">解説：</span>{' '}
                  {currentQuiz.explanation}
                </p>
                {currentQuiz.sourceUrl && (
                  <a
                    href={currentQuiz.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                  >
                    詳しく読む →
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                ホームに戻る
              </button>
              {answered && (
                <>
                  <button
                    onClick={() => {
                      // Share
                      const text = `🎮 AI Knowledge Quiz で「${selectedTheme}」に挑戦！\n正解数: ${(userProgress[selectedTheme!]?.correctAnswers || 0)}/${(userProgress[selectedTheme!]?.totalAttempts || 0)}\n🔗 https://ai-quiz-game-sooty.vercel.app/`
                      if (navigator.share) {
                        navigator.share({
                          title: 'AI Knowledge Quiz',
                          text,
                        })
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(text)
                        alert('シェアテキストをコピーしました！')
                      }
                    }}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all"
                  >
                    📤 シェア
                  </button>
                  <button
                    onClick={handleNextQuiz}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    {currentQuizIndex < themeQuizzes.length - 1
                      ? '次へ →'
                      : '結果を見る →'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== Screen: Score ==========
  if (screen === 'score' && selectedTheme) {
    const progress = userProgress[selectedTheme]
    const score = progress?.correctAnswers ?? 0
    const total = progress?.totalAttempts ?? 0
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              お疲れさま！
            </h2>
            <p className="text-gray-600 mb-8">
              「{selectedTheme}」のクイズが完了しました
            </p>

            {/* Score Display */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              <p className="text-gray-600 mb-2">正解数</p>
              <p className="text-5xl font-black text-blue-600">
                {score}/{total}
              </p>
              <p className="text-gray-600 mt-2">正答率: {percentage}%</p>
            </div>

            {/* Performance Badge */}
            <div className="mb-8">
              {percentage === 100 && (
                <p className="text-2xl">🏆 完璧です！素晴らしい！</p>
              )}
              {percentage >= 66 && percentage < 100 && (
                <p className="text-2xl">⭐ 素晴らしい成績です！</p>
              )}
              {percentage >= 33 && percentage < 66 && (
                <p className="text-2xl">👍 頑張りました！</p>
              )}
              {percentage < 33 && (
                <p className="text-2xl">💪 また挑戦してね！</p>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={() => {
                const text = `🎮 AI Knowledge Quiz で「${selectedTheme}」に挑戦！\n正解数: ${score}/${total} (${percentage}%)\n🔗 https://ai-quiz-game-sooty.vercel.app/`
                if (navigator.share) {
                  navigator.share({
                    title: 'AI Knowledge Quiz',
                    text,
                  })
                } else {
                  navigator.clipboard.writeText(text)
                  alert('シェアテキストをコピーしました！')
                }
              }}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all mb-4"
            >
              📤 結果をシェア
            </button>

            {/* Back to Home */}
            <button
              onClick={handleBackToHome}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
