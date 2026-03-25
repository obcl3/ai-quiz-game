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
      <div className="min-h-screen bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              AI Knowledge Quiz
            </h1>
            <p className="text-lg text-gray-600">
              AI業界を学ぶ。毎日のクイズで知識を深めよう。
            </p>
          </div>

          {/* Theme Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              テーマを選択
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {THEMES.map((theme) => {
                const progress = userProgress[theme]
                const score = progress?.correctAnswers ?? 0
                const total = progress?.totalAttempts ?? 0

                return (
                  <button
                    key={theme}
                    onClick={() => handleStartTheme(theme)}
                    className="p-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                      {theme}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {score}/{total} 正解
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Score Board */}
          {Object.keys(userProgress).length > 0 && (
            <div className="border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                あなたのスコア
              </h2>
              <div className="space-y-6">
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
                      <span className="font-semibold text-gray-900">{theme}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {progress.correctAnswers}/{progress.totalAttempts}
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-gray-900 h-1 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-300">
                <p className="text-lg text-gray-900">
                  総合スコア: <span className="font-bold">{getTotalScore()}</span> 問
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
      <div className="min-h-screen bg-white py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600 font-semibold">
                {selectedTheme}
              </span>
              <span className="text-sm text-gray-600">
                {currentQuizIndex + 1}/{themeQuizzes.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className="bg-gray-900 h-1 rounded-full transition-all"
                style={{
                  width: `${((currentQuizIndex + 1) / themeQuizzes.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Quiz Card */}
          <div>
            {/* Question */}
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              {currentQuiz.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-12">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isAnswered = answered

                let bgColor = 'bg-white hover:bg-gray-50'
                let borderColor = 'border-gray-300'

                if (isAnswered) {
                  if (index === currentQuiz.correctAnswer) {
                    bgColor = 'bg-white'
                    borderColor = 'border-gray-900'
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-white'
                    borderColor = 'border-gray-400'
                  } else if (!isSelected) {
                    bgColor = 'bg-gray-50'
                    borderColor = 'border-gray-300'
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg border text-left font-semibold transition-colors ${bgColor} border-${borderColor} disabled:cursor-default`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-900 rounded text-sm font-bold flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-900 flex-1">{option}</span>
                      {isAnswered && index === currentQuiz.correctAnswer && (
                        <span className="text-lg flex-shrink-0">✓</span>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <span className="text-lg flex-shrink-0">✗</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-300">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">解説</span>
                  <br />
                  {currentQuiz.explanation}
                </p>
                {currentQuiz.sourceUrl && (
                  <a
                    href={currentQuiz.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-900 mt-4 inline-block"
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
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                戻る
              </button>
              {answered && (
                <>
                  <button
                    onClick={() => {
                      // Share
                      const text = `AI Knowledge Quiz で「${selectedTheme}」に挑戦\n正解数: ${(userProgress[selectedTheme!]?.correctAnswers || 0)}/${(userProgress[selectedTheme!]?.totalAttempts || 0)}\nhttps://ai-quiz-game-sooty.vercel.app/`
                      if (navigator.share) {
                        navigator.share({
                          title: 'AI Knowledge Quiz',
                          text,
                        })
                      } else {
                        navigator.clipboard.writeText(text)
                        alert('シェアテキストをコピーしました')
                      }
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    シェア
                  </button>
                  <button
                    onClick={handleNextQuiz}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    {currentQuizIndex < themeQuizzes.length - 1
                      ? '次へ'
                      : '結果を見る'}
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
      <div className="min-h-screen bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            完了しました
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            「{selectedTheme}」のクイズが完了しました
          </p>

          {/* Score Display */}
          <div className="mb-12 p-8 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-4">正解数</p>
            <p className="text-6xl font-bold text-gray-900 mb-4">
              {score}/{total}
            </p>
            <p className="text-lg text-gray-600">正答率 {percentage}%</p>
          </div>

          {/* Performance Message */}
          <div className="mb-12">
            <p className="text-xl text-gray-700">
              {percentage === 100 && '完璧です。素晴らしい。'}
              {percentage >= 66 && percentage < 100 && '素晴らしい成績です。'}
              {percentage >= 33 && percentage < 66 && '頑張りました。'}
              {percentage < 33 && 'また挑戦してください。'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => {
                const text = `AI Knowledge Quiz で「${selectedTheme}」に挑戦\n正解数: ${score}/${total} (${percentage}%)\nhttps://ai-quiz-game-sooty.vercel.app/`
                if (navigator.share) {
                  navigator.share({
                    title: 'AI Knowledge Quiz',
                    text,
                  })
                } else {
                  navigator.clipboard.writeText(text)
                  alert('シェアテキストをコピーしました')
                }
              }}
              className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              結果をシェア
            </button>

            <button
              onClick={handleBackToHome}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
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
