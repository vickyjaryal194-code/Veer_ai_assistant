
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json(
        { message: "VEER AI Worker is running!" },
        { headers: cors }
      );
    }

    try {
      const body = await request.json();
      const message = body.message;

      if (
        typeof message !== "string" ||
        !message.trim() ||
        message.length > 1500
      ) {
        return Response.json(
          { error: "Message khali hai ya bahut lamba hai." },
          { status: 400, headers: cors }
        );
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "You are VEER AI, a helpful Hindi voice assistant. Reply naturally in Hindi or Hinglish."
            },
            {
              role: "user",
              content: message.trim()
            }
          ]
        }
      );

      return Response.json(
        { reply: result.response || "Abhi jawab nahi mila." },
        { headers: cors }
      );
        } catch (error) {
      return Response.json(
        {
          error: error instanceof Error
            ? error.message
            : String(error)
        },
        { status: 500, headers: cors }
      );
    }
