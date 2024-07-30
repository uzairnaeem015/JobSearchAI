/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

*/

import React, {useState}  from "react";
import axios from 'axios'

function App() {
  const [title, setTitle] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleDataChange = (event) => {
    setTitle(event.target.value);
  };

  const sendData = async () => {
    try{
      const response = await axios.post("http://localhost:8000/search_jobs", {
        job_title: title,
      });
      setResponseData(response.data);
    }
    catch (error){
      console.log(error);
    }

  };
  return (
      <div className="App">
        <h1> Search for jobs</h1>
        <input 
          type = "text"
          placeholder="Title"
          value= {title}
          onChange={handleDataChange}
          />
          <button onClick={sendData}>
          Search Jobs 
          </button>
          {responseData && (
            <div>
              <h2> Response data: </h2>
              <p> {JSON.stringify(responseData, null, 2)}
              </p>
            </div>
          )
          }
      </div>
  )
}

export default App;