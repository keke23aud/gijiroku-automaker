# GitHub Actions（Claude Code連携）セットアップ手順

Claude Code GitHub Actionsは、GitHub Issue/PRのコメントで `@claude` とメンションすると、
Claudeが非同期でコードを書いてPull Requestを作成してくれる仕組みです。
本業の合間の隙間時間に、Issueへコメントを残すだけで開発を進められます。

Claude（このチャット）にはGitHubへの操作権限がないため、以下の手順はご自身で実行してください。
所要時間はおよそ10〜15分です。

## 方法A: おすすめ（Claude Codeの `/install-github-app` を使う）

Claude Code Proプランをお使いなので、この方法が一番早いです。

1. ローカルに [GitHub CLI](https://cli.github.com/) をインストールし、`gh auth login` でログインしておく
2. このリポジトリ（`main-project` の中身をpush済みのGitHubリポジトリ）のフォルダで `claude` を起動する
3. `/install-github-app` と入力して実行する
4. 案内に従って進める。以下を選択:
   - GitHubアプリのインストール → 対象リポジトリを選択
   - 認証方法 → 「Claudeサブスクリプション（Pro/Max）で長期トークンを作成」を選択
     （`claude setup-token` が自動実行され、`CLAUDE_CODE_OAUTH_TOKEN` という名前でリポジトリのSecretに登録されます）
   - ワークフローの選択 → `@claude`メンション対応ワークフローを選択
5. Claude Codeが自動でブランチをpushし、GitHub上でPull Requestを開く画面を出してくれるので、
   そのPRを作成してマージする
6. これで `@claude` メンションが使えるようになります

## 方法B: 手動セットアップ

`/install-github-app` が使えない場合は、以下を手動で行います。

1. [Claude GitHub App](https://github.com/apps/claude) をこのリポジトリにインストールする
   （Contents / Issues / Pull requests の読み書き権限を付与）
2. 認証用のSecretをリポジトリに追加する（GitHubリポジトリの Settings → Secrets and variables → Actions）
   - サブスクリプション認証を使う場合: ターミナルで `claude setup-token` を実行し、
     表示されたトークンを `CLAUDE_CODE_OAUTH_TOKEN` という名前でSecretに登録
   - APIキー課金にする場合: `ANTHROPIC_API_KEY` という名前でSecretに登録し、
     `.github/workflows/claude.yml` 内の `claude_code_oauth_token` の行をコメントアウトし、
     `anthropic_api_key` の行を有効化する
3. このフォルダに同梱されている `.github/workflows/claude.yml` を、リポジトリの
   `.github/workflows/claude.yml` としてそのままコミット・pushする
4. 適当なIssueのコメントで `@claude こんにちは` と書き込み、Actionsが起動して返信が来るか確認する

## 最初に立てるIssue（コピペ用）

リポジトリ作成後、以下の内容でIssueを1つずつ作成し、本文の末尾で `@claude` とメンションしてください。
Claudeが内容を読んでPull Requestの作成に着手します。

---

### Issue 1: MVPの土台を作る

```
タイトル: MVPのフロントエンド一式をリポジトリに取り込む

本文:
議事録自動整理ツールのMVPフロントエンド（index.html、samples/以下のサンプルデータ）を
リポジトリのルートに配置してください。

- index.html: ユーザー自身のClaude APIキーで要約・決定事項・タスク抽出を行う単一HTMLファイル
- samples/demo_meeting_1.txt, samples/demo_meeting_2.txt: デモ用サンプルデータ

まずは動作確認として、ローカルで `python -m http.server` を実行すれば
http://localhost:8000 でツールが動くことを確認してください。

@claude 上記の内容でセットアップし、READMEにローカルでの動作確認手順も追記してPRを作成してください。
```

### Issue 2: デプロイ手順を整える

```
タイトル: Cloudflare Pages（またはGitHub Pages）へのデプロイ手順を整備する

本文:
index.htmlを静的サイトとして無料で公開できるように、Cloudflare PagesまたはGitHub Pagesへの
デプロイ手順をREADMEに追記してください。GitHub Actionsで自動デプロイするワークフローを
追加できる場合は、そちらも検討してください。

@claude 上記についてREADMEとワークフローの追加案を提示し、PRを作成してください。
```

### Issue 3: 入力バリデーションとUX改善

```
タイトル: 長い文字起こしテキストへの対応とエラーメッセージの改善

本文:
非常に長い会議の文字起こし（1万文字を超えるようなケース）を貼り付けた場合に、
APIのトークン上限エラーが分かりやすく表示されるようにしてください。
可能であれば、テキストが長すぎる場合に自動で分割して要約し、
最後に結合する簡易的な対応も検討してください（無理に対応せず、
まずは分かりやすいエラーメッセージだけでも構いません）。

@claude 上記の改善を実装してPRを作成してください。
```

---

これ以降は、思いついた機能追加や不具合修正のたびにIssueを立てて `@claude` とメンションするだけで、
Claudeが非同期でPull Requestを作成してくれます。内容を確認してからマージしてください。
