import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { quizzes } from './data/quizzes';
const THEMES = ['LLM', 'Vision', 'Agent'];
const STORAGE_KEY = 'ai-quiz-progress';
function App() {
    const [screen, setScreen] = useState('home');
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [userProgress, setUserProgress] = useState({});
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // Initialize from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setUserProgress(JSON.parse(saved));
        }
    }, []);
    // Save to localStorage whenever progress changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    }, [userProgress]);
    const themeQuizzes = selectedTheme
        ? quizzes.filter((q) => q.theme === selectedTheme)
        : [];
    const currentQuiz = themeQuizzes[currentQuizIndex];
    const handleAnswerClick = (index) => {
        if (answered)
            return;
        setSelectedAnswer(index);
        setAnswered(true);
        // Update progress
        if (currentQuiz) {
            const isCorrect = index === currentQuiz.correctAnswer;
            const progress = userProgress[selectedTheme] || {
                completedQuizzes: [],
                correctAnswers: 0,
                totalAttempts: 0,
                lastAttempt: new Date().toISOString(),
            };
            setUserProgress({
                ...userProgress,
                [selectedTheme]: {
                    ...progress,
                    completedQuizzes: [...new Set([...progress.completedQuizzes, currentQuiz.id])],
                    correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
                    totalAttempts: progress.totalAttempts + 1,
                    lastAttempt: new Date().toISOString(),
                },
            });
        }
    };
    const handleNextQuiz = () => {
        if (currentQuizIndex < themeQuizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setAnswered(false);
            setSelectedAnswer(null);
        }
        else {
            setScreen('score');
        }
    };
    const handleStartTheme = (theme) => {
        setSelectedTheme(theme);
        setCurrentQuizIndex(0);
        setAnswered(false);
        setSelectedAnswer(null);
        setScreen('quiz');
    };
    const handleBackToHome = () => {
        setScreen('home');
        setSelectedTheme(null);
        setCurrentQuizIndex(0);
    };
    const getTotalScore = () => {
        return Object.values(userProgress).reduce((sum, p) => sum + p.correctAnswers, 0);
    };
    // ========== Screen: Home ==========
    if (screen === 'home') {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDFAE" }), _jsx("h1", { className: "text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3", children: "AI Knowledge Quiz" }), _jsx("p", { className: "text-gray-600 text-lg", children: "AI\u696D\u754C\u3092\u5B66\u3076\u30B2\u30FC\u30E0\u3002\u6BCE\u65E5\u306E\u30AF\u30A4\u30BA\u3067\u77E5\u8B58\u3092\u6DF1\u3081\u3088\u3046\uFF01" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u30C6\u30FC\u30DE\u3092\u9078\u629E" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: THEMES.map((theme) => {
                                    const progress = userProgress[theme];
                                    const score = progress?.correctAnswers ?? 0;
                                    const total = progress?.totalAttempts ?? 0;
                                    return (_jsxs("button", { onClick: () => handleStartTheme(theme), className: "p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left", children: [_jsxs("div", { className: "text-3xl mb-2", children: [theme === 'LLM' && '🤖', theme === 'Vision' && '👁️', theme === 'Agent' && '⚙️'] }), _jsx("h3", { className: "font-bold text-lg text-gray-900 mb-2", children: theme }), _jsxs("p", { className: "text-sm text-gray-600", children: [score, "/", total, " \u6B63\u89E3"] })] }, theme));
                                }) })] }), Object.keys(userProgress).length > 0 && (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\uD83D\uDCCA \u3042\u306A\u305F\u306E\u30B9\u30B3\u30A2" }), _jsx("div", { className: "space-y-4", children: THEMES.map((theme) => {
                                    const progress = userProgress[theme];
                                    if (!progress)
                                        return null;
                                    const percentage = progress.totalAttempts > 0
                                        ? Math.round((progress.correctAnswers / progress.totalAttempts) * 100)
                                        : 0;
                                    return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-semibold text-gray-700", children: theme }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [progress.correctAnswers, "/", progress.totalAttempts] }), _jsx("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all", style: { width: `${percentage}%` } }) }), _jsxs("span", { className: "text-sm font-bold text-gray-700 w-10", children: [percentage, "%"] })] })] }, theme));
                                }) }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200", children: _jsxs("p", { className: "text-lg font-bold text-gray-900", children: ["\u7DCF\u5408\u30B9\u30B3\u30A2: ", _jsx("span", { className: "text-blue-600", children: getTotalScore() }), " \u554F"] }) })] }))] }) }));
    }
    // ========== Screen: Quiz ==========
    if (screen === 'quiz' && currentQuiz) {
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("span", { className: "text-gray-600 font-semibold", children: [selectedTheme, " \u30AF\u30A4\u30BA"] }), _jsxs("span", { className: "text-gray-600", children: [currentQuizIndex + 1, "/", themeQuizzes.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all", style: {
                                        width: `${((currentQuizIndex + 1) / themeQuizzes.length) * 100}%`,
                                    } }) })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-8", children: currentQuiz.question }), _jsx("div", { className: "space-y-3 mb-8", children: currentQuiz.options.map((option, index) => {
                                    const isSelected = selectedAnswer === index;
                                    const isAnswered = answered;
                                    let bgColor = 'bg-gray-100 hover:bg-gray-200';
                                    if (isAnswered) {
                                        if (index === currentQuiz.correctAnswer) {
                                            bgColor = 'bg-green-100 border-green-500';
                                        }
                                        else if (isSelected && !isCorrect) {
                                            bgColor = 'bg-red-100 border-red-500';
                                        }
                                    }
                                    return (_jsx("button", { onClick: () => handleAnswerClick(index), disabled: isAnswered, className: `w-full p-4 rounded-lg border-2 text-left font-semibold transition-all ${isAnswered ? 'border-2' : 'border-gray-200'} ${bgColor} disabled:cursor-default`, children: _jsxs("span", { className: "flex items-center gap-3", children: [_jsx("span", { className: "inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold", children: String.fromCharCode(65 + index) }), _jsx("span", { className: "text-gray-800", children: option }), isAnswered && index === currentQuiz.correctAnswer && (_jsx("span", { className: "ml-auto text-green-600 text-xl", children: "\u2705" })), isAnswered && isSelected && !isCorrect && (_jsx("span", { className: "ml-auto text-red-600 text-xl", children: "\u274C" }))] }) }, index));
                                }) }), answered && (_jsxs("div", { className: "mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "font-bold text-blue-600", children: "\u89E3\u8AAC\uFF1A" }), ' ', currentQuiz.explanation] }), currentQuiz.sourceUrl && (_jsx("a", { href: currentQuiz.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-blue-600 hover:underline mt-2 inline-block", children: "\u8A73\u3057\u304F\u8AAD\u3080 \u2192" }))] })), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: handleBackToHome, className: "px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all", children: "\u30DB\u30FC\u30E0\u306B\u623B\u308B" }), answered && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => {
                                                    // Share
                                                    const text = `🎮 AI Knowledge Quiz で「${selectedTheme}」に挑戦！\n正解数: ${(userProgress[selectedTheme]?.correctAnswers || 0)}/${(userProgress[selectedTheme]?.totalAttempts || 0)}\n🔗 https://ai-quiz-game-sooty.vercel.app/`;
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: 'AI Knowledge Quiz',
                                                            text,
                                                        });
                                                    }
                                                    else {
                                                        // Fallback: copy to clipboard
                                                        navigator.clipboard.writeText(text);
                                                        alert('シェアテキストをコピーしました！');
                                                    }
                                                }, className: "px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all", children: "\uD83D\uDCE4 \u30B7\u30A7\u30A2" }), _jsx("button", { onClick: handleNextQuiz, className: "flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all", children: currentQuizIndex < themeQuizzes.length - 1
                                                    ? '次へ →'
                                                    : '結果を見る →' })] }))] })] })] }) }));
    }
    // ========== Screen: Score ==========
    if (screen === 'score' && selectedTheme) {
        const progress = userProgress[selectedTheme];
        const score = progress?.correctAnswers ?? 0;
        const total = progress?.totalAttempts ?? 0;
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8 text-center", children: [_jsx("div", { className: "text-6xl mb-6", children: "\uD83C\uDF89" }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "\u304A\u75B2\u308C\u3055\u307E\uFF01" }), _jsxs("p", { className: "text-gray-600 mb-8", children: ["\u300C", selectedTheme, "\u300D\u306E\u30AF\u30A4\u30BA\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F"] }), _jsxs("div", { className: "mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl", children: [_jsx("p", { className: "text-gray-600 mb-2", children: "\u6B63\u89E3\u6570" }), _jsxs("p", { className: "text-5xl font-black text-blue-600", children: [score, "/", total] }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["\u6B63\u7B54\u7387: ", percentage, "%"] })] }), _jsxs("div", { className: "mb-8", children: [percentage === 100 && (_jsx("p", { className: "text-2xl", children: "\uD83C\uDFC6 \u5B8C\u74A7\u3067\u3059\uFF01\u7D20\u6674\u3089\u3057\u3044\uFF01" })), percentage >= 66 && percentage < 100 && (_jsx("p", { className: "text-2xl", children: "\u2B50 \u7D20\u6674\u3089\u3057\u3044\u6210\u7E3E\u3067\u3059\uFF01" })), percentage >= 33 && percentage < 66 && (_jsx("p", { className: "text-2xl", children: "\uD83D\uDC4D \u9811\u5F35\u308A\u307E\u3057\u305F\uFF01" })), percentage < 33 && (_jsx("p", { className: "text-2xl", children: "\uD83D\uDCAA \u307E\u305F\u6311\u6226\u3057\u3066\u306D\uFF01" }))] }), _jsx("button", { onClick: () => {
                                const text = `🎮 AI Knowledge Quiz で「${selectedTheme}」に挑戦！\n正解数: ${score}/${total} (${percentage}%)\n🔗 https://ai-quiz-game-sooty.vercel.app/`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'AI Knowledge Quiz',
                                        text,
                                    });
                                }
                                else {
                                    navigator.clipboard.writeText(text);
                                    alert('シェアテキストをコピーしました！');
                                }
                            }, className: "w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all mb-4", children: "\uD83D\uDCE4 \u7D50\u679C\u3092\u30B7\u30A7\u30A2" }), _jsx("button", { onClick: handleBackToHome, className: "w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all", children: "\u30DB\u30FC\u30E0\u306B\u623B\u308B" })] }) }) }));
    }
    return null;
}
export default App;
