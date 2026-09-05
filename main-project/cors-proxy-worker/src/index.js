/**
 * cors-proxy-worker
 *
 * Claude API (api.anthropic.com) への軽量な中継プロキシ (Cloudflare Workers)。
 *
 * 通常はフロントエンド(index.html)から `anthropic-dangerous-direct-browser-access`
 * ヘッダーを付けてブラウザから直接Claude APIを呼び出す構成で動作します。
 * ただし、企業ネットワークの制限やブラウザ拡張機能、将来的なAPI仕様変更などにより
 * 直接呼び出しがブロックされるケースに備えて、このWorkerをCORS回避用の代替経路として
 * 用意しています。
 *
 * このWorkerはAPIキーを一切保持・記録しません。ユーザーがブラウザに入力した
 * 自分のAPIキーを、そのままヘッダー経由でAnthropicへ中継するだけです。
 * （= 開発者側のAPIコスト負担は発生しません）
 *
 * 使い方（フロントエンド側）:
 *   fetch("https://<このWorkerのURL>/v1/messages", {
 *     method: "POST",
 *     headers: {
 *       "content-type": "application/json",
 *       "x-api-key": ユーザーのAPIキー,
 *       "anthropic-version": "2023-06-01"
 *     },
 *     body: JSON.stringify({ ... })
 *   })
 *
 * デプロイ:
 *   npm install
 *   npx wrangler login
 *   npx wrangler deploy
 *
 * このWorker自体にシークレット登録は不要です（APIキーはユーザー入力のものを都度中継するため）。
 */

const ANTHROPIC_API_BASE = "https://api.anthropic.com";

// 必要に応じて、あなたのLPのドメインだけに絞ることを推奨します。
// 例: const ALLOWED_ORIGIN = "https://your-lp-domain.com";
const ALLOWED_ORIGIN = "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-api-key, anthropic-version",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // プリフライトリクエスト
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // /v1/messages 以外は受け付けない（用途を限定してリスクを下げる）
    if (url.pathname !== "/v1/messages" || request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "not_found", message: "Use POST /v1/messages" }),
        { status: 404, headers: { "content-type": "application/json", ...corsHeaders() } }
      );
    }

    const apiKey = request.headers.get("x-api-key");
    const anthropicVersion = request.headers.get("anthropic-version") || "2023-06-01";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "missing_api_key", message: "x-api-key header is required" }),
        { status: 400, headers: { "content-type": "application/json", ...corsHeaders() } }
      );
    }

    const bodyText = await request.text();

    let upstreamRes;
    try {
      upstreamRes = await fetch(`${ANTHROPIC_API_BASE}/v1/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": anthropicVersion,
        },
        body: bodyText,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "upstream_fetch_failed", message: String(err) }),
        { status: 502, headers: { "content-type": "application/json", ...corsHeaders() } }
      );
    }

    const responseBody = await upstreamRes.text();

    return new Response(responseBody, {
      status: upstreamRes.status,
      headers: {
        "content-type": upstreamRes.headers.get("content-type") || "application/json",
        ...corsHeaders(),
      },
    });
  },
};
