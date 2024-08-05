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

/*
import React, { useState } from "react";
import axios from "axios";
import JobListing from "./JobList";
import "./JobSearch.css";
import Header from "./Header";
import Footer from "./Footer";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import Home component
import HomePage from "./Homepage";

function App() {
  const [title, setTitle] = useState("");
  const [jobSite, setSiteType] = useState("");
  const [location, setLocation] = useState("");
  const [pageSize, setPageSize] = useState("");
  const [responseData, setResponseData] = useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleJobSiteChange = (event) => {
    setSiteType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };
  const sendData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/search_jobs", {
        job_title: title,
        job_site: jobSite,
        location: location,
        page_size: pageSize
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
    <div  className="App">
      <Header />
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
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={handleLocationChange}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Page size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="search-input"
          />
          <select
            value={jobSite}
            onChange={handleJobSiteChange}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="Indeed">Indeed</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>
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
      <Footer />
    </div>
  );
}

export default App;

*/


import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
// import JobPage, { jobLoader } from './pages/JobPage';
// import AddJobPage from './pages/AddJobPage';
// import EditJobPage from './pages/EditJobPage';

const App = () => {
  /*
  // Add New Job
  const addJob = async (newJob) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });
    return;
  };

  // Delete Job
  const deleteJob = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
    return;
  };

  // Update Job
  const updateJob = async (job) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    return;
  };
  */
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/jobs' element={<JobsPage />} />
        {/* <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} /> */}
        {/* <Route
          path='/edit-job/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route
          path='/jobs/:id'
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        /> */}
        
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
