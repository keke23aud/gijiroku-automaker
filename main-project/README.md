# 議事録オートメーカー（ポートフォリオ作品一式）

会議の文字起こしテキストを貼り付けると、AIが要約・決定事項・タスク一覧を自動抽出するWebツールです。
ユーザー自身のClaude APIキーを使う方式なので、開発側でAPIコストを負担しません。

**位置づけ**: 販売する商品ではなく、ココナラ・クラウドワークスでの案件受注のための
ポートフォリオ作品として公開する前提でまとめています。

## フォルダ構成

```
main-project/
├── index.html              MVP本体（単一HTMLファイル、ライブデモ）
├── samples/                 デモ用サンプル会議データ
│   ├── demo_meeting_1.txt
│   └── demo_meeting_2.txt
├── cors-proxy-worker/        （オプション）CORS回避用Cloudflare Workerプロキシ
├── lp/                       ポートフォリオ紹介ページ（旧LP）
│   ├── index.html             紹介ページ本体
│   └── notes.html             データの取り扱い・ご利用にあたって
├── portfolio-texts/           ココナラ・クラウドワークス用の文面ドラフト
│   ├── coconala.md
│   └── crowdworks.md
├── .github/workflows/claude.yml   GitHub Actions（Claude Code連携）
└── GITHUB_SETUP.md            GitHub Actions導入手順
```

## 1. index.html（MVP本体）の動かし方

`index.html` はそのままブラウザで開いても動きますが、`samples/` のサンプル読み込み機能を使う場合は
簡易サーバー経由で開いてください（`file://` だとブラウザがサンプルファイルの読み込みをブロックするため）。

```bash
cd main-project
python -m http.server 8000
```

ブラウザで `http://localhost:8000` を開き、自分のClaude APIキーを入力して試してください。
APIキーは [Anthropic Console](https://console.anthropic.com/settings/keys) から取得できます。

### 仕組み（重要な設計判断）

`index.html` は `anthropic-dangerous-direct-browser-access` ヘッダーを付けて、
**サーバーを一切経由せずブラウザから直接Claude APIを呼び出す**構成にしています。
これにより、当初の想定にあった「フロントエンド1ページ＋軽量プロキシ」よりもさらにシンプルな
「フロントエンドのみ」の構成が実現できています（デプロイもプロキシの分だけ手間が減ります）。

もし将来的にこの直接呼び出しがブロックされる（企業ネットワークの制限、ブラウザの仕様変更、
Anthropic側の仕様変更など）場合に備えて、`cors-proxy-worker/` に代替のCloudflare Workerプロキシを
同梱しています。その場合は `index.html` 内の `fetch("https://api.anthropic.com/v1/messages", ...)` の
URLを自分のWorkerのURL（例: `https://your-worker.workers.dev/v1/messages`）に書き換え、
`anthropic-dangerous-direct-browser-access` ヘッダーの行を削除してください。

## 2. デプロイ（公開）方法

ポートフォリオとして見てもらうには、実際に触れる状態で公開しておくことが重要です。
`index.html` と `lp/` は静的ファイルなので、以下のような無料の静的ホスティングにそのまま
アップロードできます。

- **Cloudflare Pages**（推奨。rakuten-proxyですでにCloudflareアカウントをお持ちのため）
- GitHub Pages
- Netlify / Vercel

いずれも「フォルダをそのままドラッグ&ドロップ」または「GitHubリポジトリと連携して自動デプロイ」の
どちらかで公開できます。具体的な手順はGitHub Actions導入後、Issueとして立てて `@claude` に
整備してもらうことを想定しています（`GITHUB_SETUP.md` のIssue例2を参照）。

公開後、`lp/index.html` 内の以下の箇所を実際の情報に書き換えてください。

- 「お仕事のご相談」セクション: ココナラ・クラウドワークスのプロフィールURL
- 「コードは公開されていますか？」: GitHubリポジトリを公開する場合はそのURL

## 3. ポートフォリオ紹介ページ・注意書き（lp/フォルダ）

- `lp/index.html`: ツールの紹介 + 「この作品で示せること」（AI活用開発力のアピール） + お仕事の相談導線
- `lp/notes.html`: データの取り扱い・利用上の注意（販売前提のToS・特定商取引法の表示は撤去済み）

販売を前提にしていた `terms.html` / `privacy.html` / `tokushoho.html` は削除しました。
個人事業主として直接販売する場合に必要になる特定商取引法の表示（実名公開が原則必要）を
回避できる、という意味でも、ポートフォリオ経由での案件受注は匿名性の希望と相性が良い進め方です。
（ただし、ココナラ・クラウドワークス自体の本人確認・利用規約は別途確認してください）

## 4. ココナラ・クラウドワークス用の文面（portfolio-texts/フォルダ）

- `portfolio-texts/coconala.md`: プロフィール文・サービス出品文のドラフト
- `portfolio-texts/crowdworks.md`: プロフィール文・提案文テンプレートのドラフト

`[ ]` の箇所（価格・URLなど）を埋めてから、実際の登録内容にコピペしてください。

## 5. GitHub Actions（Claude Code連携）の導入

`GITHUB_SETUP.md` に手順をまとめています。GitHubへの操作はご自身で行っていただく必要があります
（このチャットからはGitHubを直接操作できないため）。GitHub Issue駆動でAIに実装を進めてもらう
この開発フロー自体も、ポートフォリオでアピールできる要素の一つです。

## 6. 公開までの残タスク

- [ ] GitHubリポジトリを作成し、このフォルダ一式をpushする（ポートフォリオとして公開する場合は公開リポジトリに）
- [ ] GitHub Actions（Claude Code連携）を導入する（`GITHUB_SETUP.md`参照）
- [ ] 静的ホスティング（Cloudflare Pages等）にデプロイし、ライブデモを触れる状態にする
- [ ] `lp/index.html` のプレースホルダー（ココナラ・クラウドワークスのプロフィールURL等）を埋める
- [ ] `portfolio-texts/` の文面を仕上げてココナラ・クラウドワークスに登録する
- [ ] 公開・発信する（X、note等でツールの紹介と合わせて告知するのも効果的）
