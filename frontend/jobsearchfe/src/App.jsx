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


function populateTable(data) {
  const tableBody = document.querySelector('#jobTable tbody');
  tableBody.innerHTML = '';

  const ids = Object.keys(data.result.id);
  ids.forEach(id => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = data.result.id[id];
      row.appendChild(idCell);

      const siteCell = document.createElement('td');
      siteCell.textContent = data.result.site[id];
      row.appendChild(siteCell);

      const jobUrlCell = document.createElement('td');
      const jobLink = document.createElement('a');
      jobLink.href = data.result.job_url[id];
      jobLink.textContent = data.result.job_url[id];
      jobUrlCell.appendChild(jobLink);
      row.appendChild(jobUrlCell);

      const titleCell = document.createElement('td');
      titleCell.textContent = data.result.title[id];
      row.appendChild(titleCell);

      const companyCell = document.createElement('td');
      companyCell.textContent = data.result.company[id];
      row.appendChild(companyCell);

      const locationCell = document.createElement('td');
      locationCell.textContent = data.result.location[id];
      row.appendChild(locationCell);

      const jobTypeCell = document.createElement('td');
      jobTypeCell.textContent = data.result.job_type[id];
      row.appendChild(jobTypeCell);

      const datePostedCell = document.createElement('td');
      datePostedCell.textContent = data.result.date_posted[id];
      row.appendChild(datePostedCell);

      const salaryCell = document.createElement('td');
      const minAmount = data.result.min_amount[id] || 'N/A';
      const maxAmount = data.result.max_amount[id] || 'N/A';
      salaryCell.textContent = `${minAmount} - ${maxAmount}`;
      row.appendChild(salaryCell);

      const currencyCell = document.createElement('td');
      currencyCell.textContent = data.result.currency[id];
      row.appendChild(currencyCell);

      const remoteCell = document.createElement('td');
      remoteCell.textContent = data.result.is_remote[id] ? 'Yes' : 'No';
      row.appendChild(remoteCell);

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = data.result.description[id];
      row.appendChild(descriptionCell);

      tableBody.appendChild(row);
  });
}


function App() {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleDataChange = (event) => {
    setTitle(event.target.value);
  };

  const sendData = async () => {
    try{
      const response = await axios.post("http://localhost:8000/search_jobs", {
        job_title: title,
        job_type: jobType,
        location: location,
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
          onChange={handleTitleChange}
          />
          <select value={jobType} onChange={handleJobTypeChange}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
          <input 
          type = "text"
          placeholder="Location"
          value= {location}
          onChange={handleLocationChange}
          />
          <button onClick={sendData}>
          Search Jobs 
          </button>
          <div>
            
          {responseData && (
            <div>
              
              <h2>Response data:</h2>
              <pre>{
                
              JSON.stringify(responseData, null, 2)
             
              
              }</pre>
            </div>
          )}
        </div>

      </div>
  )
}



export default App;