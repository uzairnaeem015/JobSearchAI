import React from 'react';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Function to get top 10 items
const getTopItems = (items) => items.slice(0, 10);

// Function to find highlighted keywords
const findHighlightedKeywords = (lists) => {
    const allKeywords = lists.flat();
    const keywordCounts = allKeywords.reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
    }, {});

    return new Set(
        Object.keys(keywordCounts).filter(count => count === lists.length)
    );
};
function ResultComponent({ data })  {
    if (data == null)
        data = data_cons; 
    const { result } = data["Gemini Result"];

    // Combine all keywords into one list
    const allKeywords = [
        ...result.missing_keywords,
        ...result.All_keywords_in_jd,
        ...result.All_keywords_in_resume
    ];

    // Unique keywords with their categories
    const uniqueKeywords = Array.from(new Set(allKeywords));
    
    // Find keywords that are in resume, missing, or neither
    const resumeKeywords = new Set(result.All_keywords_in_resume);
    const missingKeywords = new Set(result.missing_keywords);

    const getKeywordColor = (keyword) => {
        if (resumeKeywords.has(keyword)) return 'text-green-500'; // Present in resume
        if (missingKeywords.has(keyword)) return 'text-red-500';  // Missing keyword
        return 'text-black'; // Other keywords
    };

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
             {/*
            <h2 className="text-xl text-gray-700 m-8"><strong>Keywords:</strong> Red = Missing in resume, Green = Matched with Resume </h2>
            <div className="bg-white rounded-xl shadow-md p-4 h-80 overflow-y-auto">
                
                <ul className="list-disc list-inside pl-5 space-y-2">
                    {uniqueKeywords.map((keyword, index) => (
                        <li key={index} className={`text-sm ${getKeywordColor(keyword)}`}>
                            {keyword}
                        </li>
                    ))}
                </ul>
            </div>
            */}
        </div>
    );
};

export default ResultComponent;