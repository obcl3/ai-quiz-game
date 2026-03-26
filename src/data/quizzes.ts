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
  },

  // ai-agent Theme (from blog articles)
  {
    id: 'ai-agent-001',
    theme: 'Agent',
    question: 'Claude 4.6 Opusのエージェントとしての特徴として正しいのはどれか？',
    options: [
      'テキスト生成のみに特化している',
      'PC操作を代行するエージェントとしての実力は業界トップクラス',
      'オフラインでのみ動作する'
    ],
    correctAnswer: 1,
    explanation: 'Claude 4.6 Opusは、コーディングとツール操作能力が飛躍的に向上し、特にPC操作を代行する「エージェント」としての実力は現在業界トップクラスです。',
    sourceUrl: 'https://www.anthropic.com/news'
  },
  {
    id: 'ai-agent-002',
    theme: 'Agent',
    question: 'Claude 4.6 Opusの新機能「Agent Teams」の特徴として最も正確なのは？',
    options: [
      'テキスト翻訳専用の機能',
      '複雑なタスクを「プランナー」「実行役」「レビュアー」といった複数のエージェントに分担させて協力して解決する仕組み',
      'ユーザーの承認がないと何もできない'
    ],
    correctAnswer: 1,
    explanation: '複雑なタスクをAIが自ら「プランナー」「実行役」「レビュアー」といった複数のエージェントに分担させ、協力して解決する仕組みです。人間が指示を細分化する手間が省け、ビジネス自動化が劇的に加速します。',
    sourceUrl: 'https://www.anthropic.com/news'
  },
  {
    id: 'ai-agent-003',
    theme: 'Agent',
    question: 'Claude 4.6 SonnetのDesktop Control機能でできることとして最も正確なのは？',
    options: [
      'ブラウザのテキスト操作のみ',
      'PCのデスクトップ画面を直接認識し、マウスやキーボードを操作できる',
      'クラウドサービスへのアクセスのみ'
    ],
    correctAnswer: 1,
    explanation: 'Claude 4.6 SonnetがPCのデスクトップ画面を直接認識し、マウスやキーボードを操作できる「Desktop Control」機能のパブリックベータを開始しました。単なるブラウザ操作を超え、Excelや専用ソフトなどをAIが自律的に使いこなす「真のエージェント体験」が身近になります。',
    sourceUrl: 'https://www.anthropic.com/news'
  },

  // llm Theme (from blog articles)
  {
    id: 'llm-004',
    theme: 'LLM',
    question: 'Alibaba Qwen 3.5 の推論コストの削減率として正しいのはどれか？',
    options: [
      '前世代比で30%削減',
      '前世代比で60%削減',
      '前世代比で90%削減'
    ],
    correctAnswer: 1,
    explanation: 'Alibaba Qwen 3.5 は、推論コストを前世代（Qwen 3 Max）比で60%削減しながら、Google Gemini 3 Proの1/18のコストで同等以上の性能を提供します。',
    sourceUrl: 'https://alibabacloud.com/'
  },
  {
    id: 'llm-005',
    theme: 'LLM',
    question: 'Alibaba Qwen 3.5 (397B-A17B) のアーキテクチャの特徴は？',
    options: [
      '単一の大規模モデル',
      'Mixture of Experts (MoE) - 512個のエキスパート構成',
      'CNN ベースのアーキテクチャ'
    ],
    correctAnswer: 1,
    explanation: 'Qwen 3.5 は、総パラメータ数 397B、アクティブパラメータ 17B の Mixture of Experts (MoE) 構成で、512個のエキスパートと、より効率的な注意機構を採用しています。',
    sourceUrl: 'https://alibabacloud.com/'
  }
]
