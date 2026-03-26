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
      <div className="min-h-screen bg-white pb-8">
        {/* Header */}
        <div className="bg-white pt-8 pb-8 px-6 border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            AI Knowledge Quiz
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            AI業界を学ぶ。毎日のクイズで知識を深めよう。
          </p>
        </div>

        <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto">
          {/* Theme Selection */}
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              テーマを選択
            </h2>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
              {THEMES.map((theme) => {
                const progress = userProgress[theme]
                const score = progress?.correctAnswers ?? 0
                const total = progress?.totalAttempts ?? 0

                return (
                  <button
                    key={theme}
                    onClick={() => handleStartTheme(theme)}
                    className="w-full p-6 md:p-8 rounded-xl border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 text-left active:bg-gray-100"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      {theme}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      {score}/{total} 正解
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Score Board */}
          {Object.keys(userProgress).length > 0 && (
            <div className="border-2 border-gray-300 rounded-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
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
                    <div key={theme} className="flex justify-between items-center gap-4">
                      <span className="font-bold text-gray-900 min-w-16">{theme}</span>
                      <div className="flex-1 flex items-center gap-3 min-h-10">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right min-w-20">
                          <div className="text-sm text-gray-600">
                            {progress.correctAnswers}/{progress.totalAttempts}
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 pt-8 border-t-2 border-gray-300">
                <p className="text-lg md:text-xl text-gray-900">
                  総合スコア:{' '}
                  <span className="font-bold">{getTotalScore()}</span> 問
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
      <div className="min-h-screen bg-white pb-8">
        {/* Header with Progress */}
        <div className="bg-white sticky top-0 z-10 pt-6 pb-4 px-4 md:px-6 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-600 uppercase">
                {selectedTheme}
              </span>
              <span className="text-sm font-bold text-gray-600">
                {currentQuizIndex + 1}/{themeQuizzes.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuizIndex + 1) / themeQuizzes.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto">
          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
            {currentQuiz.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-10">
            {currentQuiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isAnswered = answered

              let bgColor = 'bg-white hover:bg-gray-50 border-gray-300'
              if (isAnswered) {
                if (index === currentQuiz.correctAnswer) {
                  bgColor = 'bg-gray-50 border-gray-900'
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-gray-50 border-gray-400'
                } else if (!isSelected) {
                  bgColor = 'bg-gray-50 border-gray-300'
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 md:p-5 rounded-lg border-2 text-left font-semibold transition-colors active:bg-gray-200 disabled:cursor-default min-h-16 md:min-h-20 flex items-center gap-4 ${bgColor}`}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-200 text-gray-900 rounded font-bold text-lg flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-base md:text-lg text-gray-900 flex-1 text-left">
                    {option}
                  </span>
                  {isAnswered && index === currentQuiz.correctAnswer && (
                    <span className="text-2xl flex-shrink-0">✓</span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="text-2xl flex-shrink-0">✗</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="mb-10 p-5 md:p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                <span className="font-bold text-gray-900">解説</span>
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                {currentQuiz.explanation}
              </p>
              {currentQuiz.sourceUrl && (
                <a
                  href={currentQuiz.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 inline-block font-semibold"
                >
                  詳しく読む →
                </a>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 md:gap-4">
            <button
              onClick={handleBackToHome}
              className="px-6 md:px-8 py-4 md:py-5 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors active:bg-gray-300 min-h-14 md:min-h-16 text-base md:text-lg"
            >
              戻る
            </button>
            {answered && (
              <>
                <button
                  onClick={() => {
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
                  className="px-6 md:px-8 py-4 md:py-5 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors active:bg-gray-300 min-h-14 md:min-h-16 text-base md:text-lg"
                >
                  シェア
                </button>
                <button
                  onClick={handleNextQuiz}
                  className="flex-1 px-6 md:px-8 py-4 md:py-5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors active:bg-gray-950 min-h-14 md:min-h-16 text-base md:text-lg"
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
    )
  }

  // ========== Screen: Score ==========
  if (screen === 'score' && selectedTheme) {
    const progress = userProgress[selectedTheme]
    const score = progress?.correctAnswers ?? 0
    const total = progress?.totalAttempts ?? 0
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0

    return (
      <div className="min-h-screen bg-white pb-8">
        <div className="px-4 md:px-6 py-12 md:py-16 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            完了しました
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-12">
            「{selectedTheme}」のクイズが完了しました
          </p>

          {/* Score Display */}
          <div className="mb-12 p-8 md:p-10 border-2 border-gray-300 rounded-xl bg-gray-50">
            <p className="text-sm md:text-base text-gray-600 mb-4 font-semibold">
              正解数
            </p>
            <p className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
              {score}/{total}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {percentage}%
            </p>
          </div>

          {/* Performance Message */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-gray-700 font-semibold">
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
              className="w-full px-6 py-4 md:py-5 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors active:bg-gray-300 min-h-14 md:min-h-16 text-base md:text-lg"
            >
              結果をシェア
            </button>

            <button
              onClick={handleBackToHome}
              className="w-full px-6 py-4 md:py-5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors active:bg-gray-950 min-h-14 md:min-h-16 text-base md:text-lg"
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
