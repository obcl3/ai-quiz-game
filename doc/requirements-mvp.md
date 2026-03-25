# AI Knowledge Quiz - MVP 要件定義書

**プロジェクト名**: AI Knowledge Quiz  
**目的**: AI業界のニュースを学びながら楽しむクイズゲーム  
**ユーザー**: ブログ読者 + AI学習者  
**リリース目標**: 2026-03-30  

---

## 1. MVP スコープ（Phase 1）

### 機能要件

#### F1: テーマ別クイズ表示
- **説明**: AI業界のテーマ（LLM、Vision、Agent等）ごとにクイズを表示
- **テーマ例**:
  - 「LLM（大規模言語モデル）」
  - 「Vision AI（画像認識）」
  - 「Agent（自律型AI）」
  - 「検索・RAG」
  - 「セキュリティ」
- **表示**: テーマ選択画面 → クイズ開始

#### F2: 3択問題の表示と判定
- **問題形式**: 3択クイズ
- **表示内容**:
  - 問題文
  - 3つの選択肢（A/B/C）
  - 正解判定（即座）
- **正解表示**: 
  - 正解時：✅ + 解説テキスト
  - 不正解時：❌ + 正解と解説

#### F3: スコア記録（ローカルストレージ）
- **保存内容**:
  - テーマごとの正解数
  - 日付
  - 累計スコア
- **表示**: スコアボード画面
- **仕様**: ブラウザのローカルストレージに保存

#### F4: 共有機能（SNS連携）
- **共有内容**: 「今日のクイズで X 問正解！」
- **共有先**:
  - Twitter/X
  - Discord（埋め込み）
- **ボタン**: 「シェアする」ボタン
- **フォーマット例**:
  ```
  🎮 AI Knowledge Quiz で「Vision」のクイズに挑戦！
  正解数: 3/3 
  🔗 https://ai-quiz-game.vercel.app/
  ```

---

## 2. UI/UX フロー

```
【ホーム画面】
┌─────────────────────────┐
│ 🎮 AI Knowledge Quiz    │
│                         │
│ テーマを選択:           │
│ [LLM]  [Vision]  [Agent]│
│ [検索] [セキュリティ]    │
│                         │
│ 📊 スコアボード        │
└─────────────────────────┘
         ↓
【クイズ画面】
┌─────────────────────────┐
│ テーマ: LLM             │
│ 進捗: 1/5               │
│                         │
│ Q: 「Qwen」の開発元は?  │
│                         │
│ [A] OpenAI              │
│ [B] Alibaba ✅         │
│ [C] Google              │
│                         │
│ 解説: Alibaba が開発... │
│ [次へ] [シェア]        │
└─────────────────────────┘
         ↓
【スコアボード】
┌─────────────────────────┐
│ 📊 あなたのスコア       │
│                         │
│ LLM: 3/5 (今日)         │
│ Vision: 2/5             │
│ Agent: 0/3              │
│                         │
│ 合計: 5 問正解          │
│ 連続正解: 3            │
│                         │
│ [ツイートする]         │
└─────────────────────────┘
```

---

## 3. データ構造

### 3.1 クイズデータ（ハードコード）

```typescript
interface Quiz {
  id: string
  theme: string              // "LLM", "Vision", etc.
  question: string           // 問題文
  options: [string, string, string]  // A, B, C
  correctAnswer: 0 | 1 | 2   // 正解のインデックス
  explanation: string        // 解説
  sourceUrl?: string        // 参照リンク
}

// MVP: 3テーマ × 3問 = 9問
const quizzes: Quiz[] = [
  {
    id: "llm-001",
    theme: "LLM",
    question: "Alibaba Qwen 3.5 のパラメータ数は？",
    options: ["70B", "397B-17B MoE", "200B"],
    correctAnswer: 1,
    explanation: "Qwen 3.5 は Mixture of Experts で 397B 個のパラメータを持ち、その中から 17B をアクティベーション",
    sourceUrl: "https://..."
  },
  // ... 他 8問
]
```

### 3.2 ユーザー進捗（ローカルストレージ）

```typescript
interface UserProgress {
  [theme: string]: {
    completedQuizzes: string[]  // クイズID
    correctAnswers: number
    totalAttempts: number
    lastAttempt: string        // ISO 8601 日付
  }
}

// 例
{
  "LLM": {
    "completedQuizzes": ["llm-001", "llm-002"],
    "correctAnswers": 2,
    "totalAttempts": 3,
    "lastAttempt": "2026-03-26T07:50:00Z"
  }
}
```

---

## 4. 技術仕様

### 4.1 スタック
- **フロントエンド**: React 19 + TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React useState
- **データ保存**: LocalStorage
- **デプロイ**: Vercel

### 4.2 ローカルストレージ仕様

```typescript
// キー: "ai-quiz-progress"
localStorage.setItem('ai-quiz-progress', JSON.stringify(userProgress))

// 読み込み
const progress = JSON.parse(localStorage.getItem('ai-quiz-progress') || '{}')
```

### 4.3 SNS シェア URL

```typescript
// Twitter
const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`

// Discord（埋め込みメッセージ）
const discordText = `🎮 AI Knowledge Quiz で「${theme}」に挑戦！
正解数: ${score}/${total}
🔗 ${appUrl}`
```

---

## 5. ブログ連携仕様（Phase 2 以降）

**MVP では未実装**。以下は参考：

- クイズデータを JSON ファイルとして管理
- ブログ記事に「このテーマのクイズに挑戦」ボタン
- 毎日のニュース記事公開 → 翌日クイズ公開（自動化）

---

## 6. ファイル構成

```
ai-quiz-game/
├── doc/
│   ├── requirements-mvp.md    (このファイル)
│   ├── architecture.md
│   └── api-spec.md
├── src/
│   ├── App.tsx               (メイン UI + ロジック)
│   ├── main.tsx
│   ├── index.css
│   ├── data/
│   │   └── quizzes.ts        (クイズデータ)
│   └── types/
│       └── index.ts          (TypeScript 型定義)
├── public/
│   ├── index.html
│   └── favicon.svg
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 7. MVP 完了条件（受け入れ基準）

- [ ] テーマ選択画面が表示される
- [ ] 3択クイズが表示される
- [ ] 正解/不正解の判定が正しい
- [ ] スコアがローカルストレージに保存される
- [ ] スコアボード画面で累計スコア表示
- [ ] Twitter シェアボタンが動作
- [ ] モバイル（iPhone）でレスポンシブに表示
- [ ] ブログに影響なし（独立プロジェクト）

---

## 8. 開発計画（推定）

| フェーズ | タスク | 見積 |
|---------|--------|------|
| 1 | App.tsx 実装（UI + ロジック） | 2h |
| 2 | クイズデータ定義 + テスト | 1h |
| 3 | ローカルテスト + デバッグ | 1h |
| 4 | Vercel デプロイ | 30m |
| 5 | スマホテスト + 調整 | 1h |

**合計**: 約 5.5 時間

---

**作成日**: 2026-03-26  
**ステータス**: MVP ドラフト
