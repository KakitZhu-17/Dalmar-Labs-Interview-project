'use client';
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('listening');

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(answer)
    setStatus('submit');
    try {
      setStatus('success');
      appendMessages(answer,"user")
      let response = await callAI(answer)
      await appendMessages(response,"AI")
    } catch (error) {
      setStatus('listening');
    }
    setAnswer("");
    scrollToBottom();
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  function scrollToBottom() {
      let currentPos = document.getElementById("log");
      currentPos.scrollTop = currentPos.scrollHeight;
    }

  function appendMessages(responses,role){
    let log = document.getElementById("log");
    let newMsg = document.createElement("div");
    newMsg.textContent=`${role}: ${responses}`;
    log.append(newMsg)
  }

  return (
    <>
      <h1>LLM Q&A by Kakit Zhu</h1>
      <div id="log">
        
      </div>
      <div id = "controls">
        <form onSubmit={handleSubmit}>
          <input
            value={answer}
            onChange={handleTextareaChange}
            disabled={status === 'submit'}
          />
          <button id="submitButton" disabled={answer.length === 0 || status === 'submit'}>Submit</button>
        </form>
      </div>
    </>
  );
}

async function callAI(input) {
    const apiKey ="ENTER KEY";
    const apiVersion = "2024-04-01-preview";
    const endpoint = "ENTER ENDDPOINT";
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
        console.log("Response azure full:", data.choices);
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error:", error);
        return "error"
    }
}