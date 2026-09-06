# 議事録オートメーカー

会議の文字起こしを貼り付けるだけで、要約・決定事項・担当者/期限つきのタスク一覧を自動抽出する
Webツールです。個人開発のポートフォリオ作品として公開しています。

## できること

- 会議の文字起こしテキストを貼り付けると、要約・決定事項・タスク一覧を自動抽出
- ユーザー自身のAPIキーを使う方式にすることで、会議データやAPIキーが開発者側のサーバーを
  経由しない設計（プライバシー・運用コストへの配慮）
- フレームワークに頼らない、Vanilla JS + CSSのみの単一HTML実装（ライト/ダーク両対応）

## この作品で示していること

- **生成AI(Claude API)を使った要約・情報抽出の実装**
  プロンプト設計だけでなく、JSON形式での構造化出力・パース失敗時のフォールバック・
  エラーメッセージの日本語化まで、実運用を意識して作り込んでいます。
- **Claude Code + GitHub Actionsを使ったAI駆動の開発フロー**
  GitHub Issueに要件を書いて「@claude」とメンションするだけで、AIが非同期でPull Requestを
  作成する開発体制を構築しています（`.github/workflows/`）。
- **データを預からない設計**
  会議データ・APIキーはブラウザからClaude APIへ直接送信されるだけで、サーバー側には
  一切保存されません。

## 使い方（ローカルで試す場合）

1. [Anthropic Console](https://console.anthropic.com/settings/keys) でClaude APIキーを取得
2. `main-project/index.html` をブラウザで開く
   （`samples/` のサンプル読み込み機能を使う場合は、簡易サーバー経由で開いてください）
   ```bash
   cd main-project
   python -m http.server 8000
   ```
3. ブラウザで `http://localhost:8000` を開き、APIキーを入力してサンプル会議データ
   （`main-project/samples/`）を試す

## 技術構成

- フロントエンド: Vanilla JS / CSS（単一HTMLファイル、フレームワーク不使用）
- AI: Anthropic Claude API（`anthropic-dangerous-direct-browser-access` によるブラウザからの直接呼び出し）
- （オプション）`main-project/cors-proxy-worker/`: 直接呼び出しがブロックされる環境向けの
  Cloudflare Workerプロキシ
- 開発フロー: Claude Code + GitHub Actions

## フォルダ構成

```
.
├── main-project/
│   ├── index.html            ツール本体（ライブデモ）
│   ├── samples/               デモ用サンプル会議データ
│   ├── cors-proxy-worker/     （オプション）CORS回避用Cloudflare Workerプロキシ
│   └── lp/                    紹介ページ
└── .github/workflows/         GitHub Actions（Claude Code連携）
```

## お仕事のご相談

AI活用ツールの企画・実装や、既存業務のAI自動化についてのご相談は、以下のプロフィールから
お気軽にご連絡ください。

- ココナラ: （準備中）
- クラウドワークス: （準備中）
