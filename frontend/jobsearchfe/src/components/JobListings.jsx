import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import { scroller } from 'react-scroll';
import axios from "axios";
import JobListing from "./JobList";

function JobListings() {
    const [title, setTitle] = useState("Software engineer");
    const [jobSite, setSiteType] = useState("All");
    const [location, setLocation] = useState("Dallas, TX");
    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [scrapeChange, setScrapeChange] = useState("False");
    const [lastRecordId, setLastRecordId] = useState(null);
    const [hasMoreData, setHasMoreData] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedJobIndex, setSelectedJobIndex] = useState(null);

    const resultsRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleJobClick = (index) => {
        setSelectedJobIndex(index);
    };

    useEffect(() => {
        if (initialLoad && responseData.length > 0 && resultsRef.current) {
            scroller.scrollTo('results', {
                duration: 1000,
                delay: 0,
                smooth: 'easeInOutQuart',
                offset: -100,
            });
            setInitialLoad(false);
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

    const handleScrapeChange = (event) => {
        setScrapeChange(event.target.value);
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

    const clearFileSelection = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
        // Determine color based on Similarity_score_Gensim
    const getScoreColor = (score) => {
        if (score >= 50) return 'text-green-500';    // High similarity
        if (score >= 25) return 'text-yellow-500';   // Moderate similarity
        return 'text-red-500';                       // Low similarity
    };
    const sendData = async (fetchMore = false) => {
        try {
            if (!title) {
                alert("Please enter a job title before searching");
                return;
            }

            if (!location) {
                alert("Please enter a valid location before searching");
                return;
            }

            setLoading(true);

            const api_url = import.meta.env.VITE_API_URL;
            const apiUrl = api_url + '/search_jobs';

            const formData = new FormData();
            if (file != null) {
                formData.append("file", file);
                console.log("File")
            }
            formData.append("job_title", title);
            formData.append("job_site", jobSite);
            formData.append("location", location);
            formData.append("scrape", scrapeChange);

            if (fetchMore && lastRecordId) {
                formData.append("last_id", lastRecordId);
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData
            });

            const res = await response.json();

            if (fetchMore) {
                setResponseData(prevData => [...prevData, ...res.result]);
            } else {
                setResponseData(res.result);
            }

            if (res.result.length > 0) {
                setLastRecordId(res.result[res.result.length - 1].orgid);
                setHasMoreData(res.result.length === 10);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (fetchMore == false) {
                setSelectedJobIndex(0);
            }
            setLoading(false);
            setInitialLoad(!fetchMore);
        }
    };

    return (
        <div className="App">
            <div className="job-search-container">
                <div className='container m-auto max-w-2xl py-8'>
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
                            required
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
                            required
                        />
                        <label className='block text-gray-700 font-bold mb-2'>
                            Scrape data? Yes: scrape data from web, No: Fetch scraped data from DB
                        </label>
                        <select
                            value={scrapeChange}
                            onChange={handleScrapeChange}
                            className='border rounded w-full py-2 px-3'
                        >
                            <option value="False">No</option>
                            <option value="True">Yes</option>
                        </select>

                        <label className='block text-gray-700 font-bold mb-2'>
                            Source
                        </label>
                        <select
                            value={jobSite}
                            onChange={handleJobSiteChange}
                            className='border rounded w-full py-2 px-3'
                        >
                            <option value="All">All Types</option>
                            <option value="Indeed">Indeed</option>
                            <option value="Glassdoor">Glassdoor</option>
                            <option value="LinkedIn">LinkedIn</option>
                        </select>
                        <br />
                        <br />
                        <div className="flex flex-col items-start space-y-2">
                            <label htmlFor="pdf-upload" className='block text-gray-700 font-bold mb-2'>
                                Select Resume:
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    id="pdf-upload"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="file:bg-indigo-500 file:hover:bg-indigo-600 file:text-white file:py-2 file:px-4 file:rounded-full file:border-none file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={clearFileSelection}
                                    className=""
                                >
                                    Clear file selection
                                </button>
                            </div>
                        </div>
                        <br />
                        <button onClick={() => sendData(false)} className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'>
                            Search Jobs
                        </button>
                    </div>
                </div>
            </div>

           {(selectedJobIndex !== null && <div className="flex">
                <div className="w-1/3 overflow-y-auto h-screen p-8">
                    {loading ? (
                        <Spinner loading={loading} />
                    ) : (<></>)}
                    <div id="results" ref={resultsRef}>
                        {responseData.map((job, index) => (
                            <div
                                key={index}
                                onClick={() => handleJobClick(index)}
                                className={`cursor-pointer flex items-start p-2 rounded-md ${selectedJobIndex === index ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
                            >
                                {job.logo_photo_url && (
                                    <a 
                                      href={job.company_url_direct  || job.company_url} 
                                      target='_blank' 
                                      rel='noopener noreferrer'
                                      className='mr-4'
                                    >
                                      <img 
                                        src={job.logo_photo_url} 
                                        alt={`${job.company} logo`} 
                                        className='h-12 w-12 object-contain mr-4' 
                                      />
                                    </a>
                                )}
                                <div>
                                    <h3 className="font-bold">{index + 1}. {job.title}</h3>
                                    <p className="text-sm">{job.company}</p>
                                    <p className="text-sm">{job.similarity_matched_keywords == 0 ? "" : job.similarity_matched_keywords}</p>
                                </div>
                            </div>
                        ))}
                        {hasMoreData && !loading && scrapeChange === "False" && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => sendData(true)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-2/3 p-4">
                    {selectedJobIndex !== null && (
                        <JobListing job={responseData[selectedJobIndex]} />
                    ) }
                </div>
            </div>
            )}
        </div>
    );
}

export default JobListings;
