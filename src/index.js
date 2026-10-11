const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET") {
      return jsonResponse({
        success: true,
        message: "VEER AI Worker is running!"
      });
    }

    if (
      request.method !== "POST" ||
      (url.pathname !== "/" && url.pathname !== "/api/chat")
    ) {
      return jsonResponse({ error: "Route not found." }, 404);
    }

    try {
      const body = await request.json();
      const message = body?.message;

      if (
        typeof message !== "string" ||
        !message.trim() ||
        message.length > 1500
      ) {
        return jsonResponse({
          error: "Message khali hai ya 1500 characters se lamba hai."
        }, 400);
      }

      if (!env.AI || typeof env.AI.run !== "function") {
        return jsonResponse({
          error: "AI binding nahi mili. Cloudflare mein AI binding ka naam AI rakho."
        }, 500);
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "You are VEER AI, a friendly Hindi AI assistant. Reply naturally in Hindi or Hinglish. Be accurate and concise."
            },
            {
              role: "user",
              content: message.trim()
            }
          ],
          max_tokens: 512
        }
      );

      const reply = result?.response;

      if (typeof reply !== "string" || !reply.trim()) {
        return jsonResponse({
          error: "AI se khaali jawab mila."
        }, 502);
      }

      return jsonResponse({
        success: true,
        reply: reply.trim()
      });
    } catch (error) {
      console.error("VEER AI error:", error);

      return jsonResponse({
        error: error instanceof Error
          ? error.message
          : String(error)
      }, 500);
    }
  }
};
