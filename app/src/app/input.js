'use client';
import { useState } from 'react';
import callAI from './llm.js';

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

  function handleInputChange(e) {
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
    newMsg.style.position = 'relative';
    newMsg.style.zIndex = "2";
    log.append(newMsg)
  }

  function handleEnterKeyDown(e){
    if (e.key === 'Enter') {
      if(answer.length !== 0 && status !== 'submit'){
        handleSubmit;
      }
    }
  };

  return (
    <>
      <h1>LLM Q&A by Kakit Zhu</h1>
      <div className="box">
        <div className="eye"></div>
      </div>
      <div id="log">
      </div>
      <div id = "controls">
        <form onSubmit={handleSubmit}>
          <input
            onKeyDown={handleEnterKeyDown}
            value={answer}
            onChange={handleInputChange}
            disabled={status === 'submit'}
          />
          <button id="submitButton" disabled={answer.length === 0 || status === 'submit'}>Submit</button>
        </form>
      </div>
    </>
  );
}