import { Quiz } from '../types'

export const quizzes: Quiz[] = [
  // LLM Theme
  {
    id: 'llm-001',
    theme: 'LLM',
    question: 'Alibaba Qwen 3.5 のアーキテクチャは？',
    options: ['単一の大規模モデル', 'Mixture of Experts (MoE)', 'Attention のみ'],
    correctAnswer: 1,
    explanation: 'Qwen 3.5 は Mixture of Experts (MoE) アーキテクチャを採用しており、合計 397B 個のパラメータから、各トークンに対して 17B をアクティベートします。これによりパラメータ数は大きいが、計算効率が高いモデルになっています。',
    sourceUrl: 'https://qwenlm.github.io/'
  },
  {
    id: 'llm-002',
    theme: 'LLM',
    question: 'Claude Sonnet 4.6 の特徴として正しいのは？',
    options: [
      'Opus より 5 倍高速',
      'Opus と同等の性能で 5 倍安い',
      'Vision 機能がない'
    ],
    correctAnswer: 1,
    explanation: 'Claude Sonnet 4.6 は Opus と比べて、多くのタスクで同等またはそれ以上の性能を発揮しながら、コストが 5 倍安いモデルです。推論速度も大幅に改善されています。',
    sourceUrl: 'https://www.anthropic.com/'
  },
  {
    id: 'llm-003',
    theme: 'LLM',
    question: 'GPT-4o の主な利点は？',
    options: [
      'テキストのみ対応',
      'マルチモーダル対応で低コスト',
      'オフラインのみ動作'
    ],
    correctAnswer: 1,
    explanation: 'GPT-4o はテキスト、画像、音声のマルチモーダル入出力に対応しており、前世代の GPT-4 Turbo と比べて同等の性能をより低いコストで提供しています。',
    sourceUrl: 'https://openai.com/'
  },

  // Vision Theme
  {
    id: 'vision-001',
    theme: 'Vision',
    question: 'Vision Transformer (ViT) の主な革新は？',
    options: [
      'CNN を画像処理に特化させた',
      '画像を Patch に分割して Transformer に入力',
      '畳み込み層の数を増やした'
    ],
    correctAnswer: 1,
    explanation: 'Vision Transformer は、従来の CNN ベースのアプローチから転換し、画像を小さなパッチに分割し、それを Transformer に入力することで、自然言語処理と同じアーキテクチャで画像理解を実現しました。',
    sourceUrl: 'https://arxiv.org/abs/2010.11929'
  },
  {
    id: 'vision-002',
    theme: 'Vision',
    question: 'CLIP モデルの特徴は？',
    options: [
      'テキストのみを処理',
      '画像とテキストの関連性を学習',
      '動画専用'
    ],
    correctAnswer: 1,
    explanation: 'CLIP (Contrastive Language-Image Pre-training) は、大規模な画像とテキストのペアから学習し、画像とテキストの関連性を理解できるマルチモーダルモデルです。ゼロショット分類などに活用されています。',
    sourceUrl: 'https://openai.com/research/learning-transferable-models-for-compositional-visual-recognition'
  },
  {
    id: 'vision-003',
    theme: 'Vision',
    question: 'Google の Gemini Vision の強みは？',
    options: [
      '画像サイズが小さいのみ対応',
       'PDFや数百枚の画像処理に対応',
      '動画処理不可'
    ],
    correctAnswer: 1,
    explanation: 'Google Gemini Vision は、単一の画像だけでなく、PDF ドキュメント、スクリーンショット、複数ページの文書、さらには数百枚の画像を一度に処理できる高度な Vision 機能を備えています。',
    sourceUrl: 'https://deepmind.google/technologies/gemini/'
  },

  // Agent Theme
  {
    id: 'agent-001',
    theme: 'Agent',
    question: 'AI Agent の定義として最も正確なのは？',
    options: [
      'ユーザーの質問に対して一度だけ応答する',
      '環境から観測し、意思決定して行動を繰り返すシステム',
      '単に出力テキストを生成するモデル'
    ],
    correctAnswer: 1,
    explanation: 'AI Agent は、環境からの入力（観測）に基づいて判断し、行動を実行し、その結果をフィードバックとして受け取る循環プロセスを持つシステムです。これは単一の応答ではなく、継続的な相互作用を行います。',
    sourceUrl: 'https://www.anthropic.com/'
  },
  {
    id: 'agent-002',
    theme: 'Agent',
    question: 'ReAct (Reasoning + Acting) パターンの特徴は？',
    options: [
      'テキスト生成のみ',
      '思考 (Thought) → 行動 (Action) → 観察 (Observation) のループ',
      'データベース検索のみ'
    ],
    correctAnswer: 1,
    explanation: 'ReAct は、Agent が「思考ステップ」を明示的に生成し、その後「行動」を実行し、その結果を「観察」として取り込むパターンです。このループにより、より堅牢で解釈可能な Agent が実現されます。',
    sourceUrl: 'https://arxiv.org/abs/2210.03629'
  },
  {
    id: 'agent-003',
    theme: 'Agent',
    question: 'Tool Use (ツール利用) の目的は？',
    options: [
      'Agent の複雑さを増す',
      'LLM の能力を外部ツール（検索、計算など）で拡張',
      'ユーザーインターフェースの改善のみ'
    ],
    correctAnswer: 1,
    explanation: 'Tool Use (関数呼び出し) により、Agent は LLM の知識だけに頼らず、リアルタイムの情報検索、計算、データベース操作など、外部のツールやサービスを活用して、より正確で実用的な結果を生成できます。',
    sourceUrl: 'https://openai.com/research/function-calling-and-other-api-updates'
  }
]
