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
import React, { useState } from "react";
import axios from "axios";
import JobListing from "./JobList";
import "./JobSearch.css";

function App() {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [responseData, setResponseData] = useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const sendData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/search_jobs", {
        job_title: title,
        job_type: jobType,
        location: location,
      });
      const data = response.data;
      const parseData = JSON.parse(data.result);
      console.log(parseData);
      setResponseData(parseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div >
      <div className="job-search-container" >
        <h1>Search for jobs</h1>
        <div className="search-fields">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className="search-input"
          />
          <select
            value={jobType}
            onChange={handleJobTypeChange}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={handleLocationChange}
            className="search-input"
          />
          <button onClick={sendData} className="search-button">
            Search Jobs
          </button>
        </div>
      </div>
      <div className="job-listings-container">
        {responseData.map((job, index) => (
          <JobListing key={index} job={job} />
        ))}
      </div>
    </div>
  );
}

export default App;
