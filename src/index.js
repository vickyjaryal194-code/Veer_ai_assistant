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
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    if (request.method === "GET") {
      return jsonResponse({
        success: true,
        message: "VEER AI Worker is running!"
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({
        error: "Only GET and POST requests are supported."
      }, 405);
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
          error: "AI binding nahi mili. Cloudflare Worker mein AI binding ka naam AI hona chahiye."
        }, 500);
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content:
                "You are VEER AI, a friendly and helpful Hindi AI assistant. Reply naturally in Hindi or Hinglish. Be clear, accurate, and concise."
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
          error: "AI ne khaali jawab diya. Dobara try karo."
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
