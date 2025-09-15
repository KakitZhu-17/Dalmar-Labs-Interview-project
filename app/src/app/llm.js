export default async function callAI(input) {
  const apiFile = require("../../env.json");
  const apiKey = apiFile["api_key"];
  const endpoint = apiFile["endpoint"];
  const apiVersion = "2024-04-01-preview";
  const modelName = "gpt-4o-mini";
  const deployment = "gpt-4o-mini";
  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const headers = {
    "Content-Type": "application/json",
    "api-key": apiKey
  };

  const body = {
    model: modelName,
    messages: [
      {role: "system", content: "polite Q&A bot"},
      {role: "user", content: input }
    ],
    temperature: 1.0,
    max_tokens: 500
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
      });

      const data = await response.json();
      //console.log("Response azure full:", data.choices);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      return "error"
    }
}