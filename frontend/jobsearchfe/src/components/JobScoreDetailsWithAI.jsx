import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import axios from "axios";
import ResultComponent from "./ScoreDetailResponse";

function JobScoreDetail() {
    const [file, setFile] = useState(null);
    const [text, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseData, setData] = useState(null);
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      } else {
        alert("Please upload a valid PDF file.");
      }
    };


    const handleTextChange = (event) => {
      setDescription(event.target.value);
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!file) {
        alert("Please upload a PDF file before submitting.");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", text);
  
      try {

        setLoading(true);
        
        const api_url = import.meta.env.VITE_API_URL;
        const apiUrl = api_url + '/score_detail';

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData
        });
  
        const result = await response.json();
        console.log(result);
        setData(result);
        
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
      finally {
        setLoading(false);
      }
    };

      return (
        <div className="App bg-gray-100 min-h-screen relative ">
            <div className="job-search-container bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto mt-8">
                <div className="text-center mb-6">
                    {/* <h1 className='text-4xl font-extrabold text-black sm:text-5xl md:text-6xl'>
                      Search for jobs
                    </h1> */}
                </div>
                <h2 className="text-lg font-semibold mb-4">Select a Resume in PDF format and paste job description</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="pdf-upload" className="block text-gray-700 font-bold mb-2">
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
                    <div className="flex flex-col">
                        <label htmlFor="text-box" className="block text-gray-700 font-bold mb-2">
                            Job Description:
                        </label>
                        <textarea
                            id="text-box"
                            value={text}
                            onChange={handleTextChange}
                            rows="8"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline">
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8">
                {loading ? (
                    <Spinner loading={loading} />
                ) : (
                    responseData && <ResultComponent data={responseData} />
                )}
            </div>
        </div>
    );
  }
export default JobScoreDetail;
