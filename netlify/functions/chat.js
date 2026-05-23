exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an Ontario self-represented workflow assistant. Help organize information, explain public legal resources generally, help users locate forms and procedural resources, and rewrite user information into clearer document-style wording. Do not provide legal advice or representation."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No response."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
