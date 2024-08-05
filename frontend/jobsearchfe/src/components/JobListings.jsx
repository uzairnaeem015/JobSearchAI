import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import axios from "axios";
import JobListing from "./JobList";

function JobListings() {
    const [title, setTitle] = useState("Software engineer");
    const [jobSite, setSiteType] = useState("");
    const [location, setLocation] = useState("Dallas, TX");
    const [pageSize, setPageSize] = useState("2");
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(false);
  
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
        
        setLoading(true);
        const apiUrl = '/api/search_jobs';

        if (title == '')
        {
          setTitle('Software engineer');
        }
        if (location == '')
        {
          setLocation('Dallas, TX');
        }
        if (pageSize == '')
        {
          setPageSize('2');
        }

        const response = await axios.post(apiUrl, {
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
      finally {
        setLoading(false);
      }
    };
  
    return (
      <div  className="App">
        <div className="job-search-container" >
        <div className='text-center'>
            {/* <h1 className='text-4xl font-extrabold text-black sm:text-5xl md:text-6xl'>
              Search for jobs
            </h1> */}
          </div>
          <div className='container m-auto max-w-2xl py-24'>
            <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
              <label className='block text-gray-700 font-bold mb-2'>
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                className='border rounded w-full py-2 px-3 mb-2'
              />
              <label className='block text-gray-700 font-bold mb-2'>
                Location
              </label>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
                className='border rounded w-full py-2 px-3 mb-2'
              />
              <label className='block text-gray-700 font-bold mb-2'>
                Page size
              </label>
              <input
                type="text"
                placeholder="Page size"
                value={pageSize}
                onChange={handlePageSizeChange}
                className='border rounded w-full py-2 px-3 mb-2'
              />
              <label className='block text-gray-700 font-bold mb-2'>
                Source
              </label>
              <select
                value={jobSite}
                onChange={handleJobSiteChange}
                className='border rounded w-full py-2 px-3'
              >
                <option value="">All Types</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
              <br/>
              <br/>
              <button onClick={sendData} className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'>
                Search Jobs
              </button>
            </div>
          </div>
        </div>
        {loading ? (<Spinner loading={loading} />) : 
        (<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {responseData.map((job, index) => (
            <JobListing key={index} job={job} />
          ))}
        </div>
        )}
      </div>
    );
  }
  
export default JobListings;
