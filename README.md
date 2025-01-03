# SetFlow-Optimizer

舞台やイベントの出演順を最適化する Web アプリケーションです。動的計画法を用いて、演者の連続出演を最小限に抑えた最適なセットリストを自動で算出します。

## 開発の背景

このプロジェクトは、実際のダンスサークルでの課題から生まれました。サークルの幹部たちが、イベントの度に「セットリスト作成が難しい」と言っているを聞き、この課題を解決したいと考えました。
当初は、サークル内で使用する簡単なアルゴリズムとして開発したものでしたが、この課題は他の多くの団体やイベント主催者も直面している可能性があると考え、誰でも利用できる Web アプリケーションとして開発しました。

## このアプリの目的

- 同じ演者の連続出演を防ぎ、適切な休憩時間を確保
- 手作業による試行錯誤と調整の工数削減

## ターゲットユーザー

- ダンスサークル
- 学校行事の企画担当者
- イベント企画、運営会社

## デモ

デモサイト: https://set-flow-optimizer.vercel.app/
デモサイトでは、サンプルデータを使って機能をお試しいただけます。画面右上の「テスト」ボタンから、ランダムなデータを生成できます。

## 主要機能

- スケジュール最適化
- デモ用テストケース自動生成機能
- xlsx ファイルの入出力

## UI/UX

- 直感的なフォームインターフェース
- 演目数に応じた動的フォーム生成
- 計算処理中のスケルトンローディング表示
- 処理状態を示すトースト通知

## 技術的こだわり

1. バリデーション

- zod、React Hook Form によるバリデーション
- pydantic によるバリデーション

2. 最適化アルゴリズム

- 動的計画法による効率的な解の探索

3. レスポンシブな UI

- トースト通知による処理状態の可視化
- 動的なフォーム生成による柔軟な入力対応

4. 使いやすさ

- Excel 入出力対応
- テストケース自動生成によるでも利用の促進

## 今後の展望

- より複雑な制約条件への対応

## フロントエンド

- Next.js (React)
- TypeScript
- Tailwind CSS
- shadcn/ui
- zod
- React Hook Form

## バックエンド

- FastAPI (Python)
- Pydantic

## インフラ

Vercel (フロントエンド)
Render (バックエンド)
