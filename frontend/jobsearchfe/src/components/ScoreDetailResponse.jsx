import React from 'react';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';


function ResultComponent({ data })  {
    if (data == null)
        data = data_cons; 
    const { result } = data["Gemini Result"];

    console.log(data);
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Match Percentage</h2>
                <p className="text-lg text-gray-600">{result.match_percentage}</p>
            </div>
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Explanation</h2>
                <p className="text-gray-600">{result.explanation}</p>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-gray-700">Enhancement Tips</h2>
                <ul className="list-disc list-inside pl-5 space-y-2">
                    {result.enhancement_tips.map((tip, index) => (
                        <li key={index} className="text-gray-600">{tip}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Missing Keywords</h2>
                <ul className="list-disc list-inside pl-5 space-y-2">
                    {result.missing_keywords.map((keyword, index) => (
                        <li key={index} className="text-gray-600">{keyword}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">All keywords in job description</h2>
                <ul className="list-disc list-inside pl-5 space-y-2">
                    {result.All_keywords_in_jd.map((keyword, index) => (
                        <li key={index} className="text-gray-600">{keyword}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">All keywords in Resume</h2>
                <ul className="list-disc list-inside pl-5 space-y-2">
                    {result.All_keywords_in_resume.map((keyword, index) => (
                        <li key={index} className="text-gray-600">{keyword}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ResultComponent;