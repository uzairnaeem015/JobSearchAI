import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import axios from "axios";
import JobListing from "./JobList";

function JobListings() {
    const [title, setTitle] = useState("Software engineer");
    const [jobSite, setSiteType] = useState("All");
    const [location, setLocation] = useState("Dallas, TX");
    const [pageSize, setPageSize] = useState("2");
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
  
    const resultsRef = useRef(null); // Create a reference for the results section

    useEffect(() => {
      if (responseData.length > 0 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [responseData]);
    
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      } else {
        alert("Please upload a valid PDF file.");
      }
    };

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
        
        if (!file) {
          alert("Please upload a PDF file before submitting.");
          return;
        }

        setLoading(true);
        const apiUrl = '/api/search_jobs';

        if (jobSite == '')
        {
          setSiteType('All');
        }
        console.log(jobSite);
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

        const formData = new FormData();
        formData.append("file", file);
        formData.append("job_title", title);
        formData.append("job_site", jobSite);
        formData.append("location", location);
        formData.append("page_size", pageSize);

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData
        });
        /*
        const response = await axios.post(apiUrl, {
          job_title: title,
          job_site: jobSite,
          location: location,
          page_size: pageSize
        });
        */
        const res = await response.json();
        console.log(res);
        
        // const data = result;
        // const parseData = JSON.parse(result);
        // console.log(parseData);
        setResponseData(res.result);
        console.log(responseData);

        // Scroll to the results section
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
              <div className="flex flex-col items-start space-y-2">
                <label htmlFor="pdf-upload" className='block text-gray-700 font-bold mb-2'>
                  Select Resume:
                </label>
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="file:bg-blue-500 file:text-white file:py-2 file:px-4 file:rounded-md file:border-none file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <br/>
              <button onClick={sendData} className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'>
                Search Jobs
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className='bg-gray-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2' ref={resultsRef}>
            {responseData.map((job, index) => (
              <JobListing key={index} job={job} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
export default JobListings;
