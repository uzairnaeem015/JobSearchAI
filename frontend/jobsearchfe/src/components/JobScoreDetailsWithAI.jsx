import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { useEmailGlobalVariable } from './GlobalVariables';


function JobScoreDetail({ description, onResult }) {
    const [file, setFile] = useState(null);
    const [text, setDescription] = useState('');
    const [llm, setLLM] = useState("gemini-1.5-flash");
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailGlobalVariable, setEmailGlobalVariable] = useEmailGlobalVariable('email', '');

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }; 

    const handleApiKeyChange = (event) => {
        setApiKey(event.target.value);
    };

    const handleLLMChange = (event) => {
      setLLM(event.target.value);
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
  
      if (llm === "gemini-1.5-pro" && !apiKey) {
        alert("Please enter an API key for Google Gemini Pro 1.5.");
          return;
      }
      if (llm === "gemini-1.5-flash") {
        setApiKey('');
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", text);
      formData.append("model", llm);
        if (llm === "gemini-1.5-pro") {
            formData.append("api_key", apiKey);
        }
        formData.append("email", emailGlobalVariable);

      try {

        setLoading(true);
        
        const api_url = import.meta.env.VITE_API_URL;
        const apiUrl = api_url + '/score_detail';
        
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData
        });
  
        const result = await response.json();
        //console.log(result);
        //setData(result);
        onResult(result);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
      finally {
        setLoading(false);
      }
    };

      return (
        <div className="App bg-gray-100 relative ">
            <div className="job-search-container bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto">

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

                    <div>
                      <label className='block text-gray-700 font-bold mb-2'>
                        Model
                      </label>
                      <select
                        value={llm}
                        onChange={handleLLMChange}
                        className='border rounded w-full py-2 px-3'
                      >
                        <option value="gemini-1.5-flash">Google Gemini Flash 1.5</option>
                        <option value="gemini-1.5-pro">Google Gemini Pro 1.5</option>
                      </select>
                    </div>
                    <div>
                    {llm === "gemini-1.5-pro" && (
                        <div className="flex flex-col">
                            <label htmlFor="api-key" className="block text-gray-700 font-bold mb-2">
                                Enter API Key:
                            </label>
                            <input
                                type="password"
                                id="api-key"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-box" className="block text-gray-700 font-bold mb-2">
                            Job Description:
                        </label>
                        <textarea
                            id="text-box"
                            value={text == '' ? description : text}
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
            
            {/* <div className="mt-8">
                {loading ? (
                    <Spinner loading={loading} />
                ) : (
                    responseData && <ResultComponent data={responseData} />
                )}
            </div> */}
            <div className="mt-8">
                {loading && <Spinner loading={loading} />}
            </div>
        </div>
    );
  }
export default JobScoreDetail;
