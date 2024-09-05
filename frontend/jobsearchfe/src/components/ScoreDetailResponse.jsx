import React, { useState } from 'react';

function ResultComponent({ data }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedJson, setEditedJson] = useState("");
    const [parsedResult, setParsedResult] = useState(null);

    if (!data || data == null) {
        return <div></div>;
    }

    if (!data["Gemini Result"]) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                <p className="text-lg text-red-600">Unable to parse the output from Gemini.</p>
            </div>
        );
    }

    if (data["Gemini Result"] === "Invalid API key. Please pass a valid API key.") {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                <p className="text-lg text-red-600">Invalid API key. Please pass a valid API key.</p>
            </div>
        );
    }

    let { result } = data["Gemini Result"];
    
    let cleanedJsonString = "";
    if (result === undefined) {
        try {
            cleanedJsonString = String(data["Gemini Result"]);
            cleanedJsonString = cleanedJsonString.replace("```json", "").replace("```", "").replace(/\n/g, ' ');
            
            const jsonObject = JSON.parse(cleanedJsonString);
            result = jsonObject["result"];
        } catch (e) {
            result = undefined;
            console.error(e);
        }
    }

    const handleEditClick = () => {
        setEditedJson(cleanedJsonString);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        try {
            const jsonObject = JSON.parse(editedJson);
            setParsedResult(jsonObject["result"]);
            setIsEditing(false);
        } catch (e) {
            alert("Invalid JSON format. Please correct it.");
            console.error(e);
        }
    };

    const highlightDifferences = (original, optimized) => {
        const originalWords = original.split(' ');
        const optimizedWords = optimized.split(' ');

        return optimizedWords.map((word, index) => {
            if (originalWords[index] !== word) {
                return <span key={index} className="text-yellow-500 font-bold">{word} </span>;
            }
            return <span key={index}>{word} </span>;
        });
    };

    return (
        <div>
            {parsedResult || result ? (
                <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Match Percentage</h2>
                        <p className="text-lg text-gray-600">{parsedResult ? parsedResult.match_percentage : result.match_percentage}</p>
                    </div>
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Explanation</h2>
                        <p className="text-gray-600">{parsedResult ? parsedResult.explanation : result.explanation}</p>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">Enhancement Tips</h2>
                        <ul className="list-disc list-inside pl-5 space-y-2">
                            {(parsedResult ? parsedResult.enhancement_tips : result.enhancement_tips).map((tip, index) => (
                                <li key={index} className="text-gray-600">{tip}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Line-by-Line Analysis</h2>
                        <ul className="list-disc list-inside pl-5 space-y-4">
                            {(parsedResult ? parsedResult.Analysis : result.Analysis).map((line, index) => (
                                <li key={index} className="text-gray-600">
                                    <p>
                                        <strong>Original:</strong> {line.original_line}
                                    </p>
                                    <p>
                                        <strong>Optimized:</strong> {highlightDifferences(line.original_line, line.optimized_line)}
                                    </p>
                                    <p>
                                        <strong>Score:</strong> {line.line_score}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Experience required in each tech mentioned in the job description</h2>
                        <ul className="list-disc list-inside pl-5 space-y-2">
                            {(parsedResult ? parsedResult.experience_required : result.experience_required).map((exp, index) => (
                                <li key={index} className="text-gray-600">
                                    <p>
                                        <strong>Tech:</strong> {exp.tech}
                                    </p>
                                    <p>
                                        <strong>Experience Required:</strong> {exp.exp_required}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Sponsorship requirement</h2>
                        <p className="text-gray-600">{parsedResult ? parsedResult.sponosorship_status : result.sponosorship_status}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Missing Keywords</h2>
                        <ul className="list-disc list-inside pl-5 space-y-2">
                            {(parsedResult ? parsedResult.missing_keywords : result.missing_keywords).map((keyword, index) => (
                                <li key={index} className="text-gray-600">{keyword}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">All keywords in job description</h2>
                        <ul className="list-disc list-inside pl-5 space-y-2">
                            {(parsedResult ? parsedResult.All_keywords_in_jd : result.All_keywords_in_jd).map((keyword, index) => (
                                <li key={index} className="text-gray-600">{keyword}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">All keywords in Resume</h2>
                        <ul className="list-disc list-inside pl-5 space-y-2">
                            {(parsedResult ? parsedResult.All_keywords_in_resume : result.All_keywords_in_resume).map((keyword, index) => (
                                <li key={index} className="text-gray-600">{keyword}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                    <p className="text-lg text-red-600">Invalid JSON response. Here is the raw text:</p>
                    {isEditing ? (
                        <div>
                            <textarea
                                className="w-full h-40 p-2 border border-gray-300 rounded-lg"
                                value={editedJson}
                                onChange={(e) => setEditedJson(e.target.value)}
                            />
                            <button
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600">{cleanedJsonString}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={handleEditClick}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResultComponent;
