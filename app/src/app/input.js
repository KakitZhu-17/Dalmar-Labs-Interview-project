'use client';
import { useState } from 'react';
import callAI from './llm.js';

let msg=[
  {role: "system", content: "Q&A bot but you are an english butler"}
]

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('listening');

  async function handleSubmit(e) {
    e.preventDefault();
    msg.push({role: "user", content: answer})
    setStatus('submit');
    try {
      let loadingEye =document.getElementById("eye");
      loadingEye.style.animationPlayState = "paused";
      loadingEye.style.animation = "thinking 2s infinite linear";
      loadingEye.style.animationPlayState = "running";

      appendMessages(answer,"You","grey");
      let response = await callAI(answer,msg);
      msg.push({role: "system", content: response });
      appendMessages(response,"Jarvin","white");
      setStatus('success');

      loadingEye.style.animation = "look-around 5s infinite ease-in-out";
      loadingEye.style.animationPlayState = "running";
      loadingEye.style.background = "#000000ff";
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

  function appendMessages(responses,role,color){
    let log = document.getElementById("log");
    let newMsg = document.createElement("div");
    newMsg.textContent=`${role}: ${responses}`;
    newMsg.style.position = 'relative';
    newMsg.style.color = color;
    newMsg.style.zIndex = "2";
    log.append(newMsg);
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
      <h1>Jarvin Q&A AI by Kakit Zhu</h1>
      <div className="box">
        <div id="eye"></div>
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