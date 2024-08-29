import React from 'react';

function ResultComponent({ data })  {

    if (!data || data == null) {
        // Handle the case where data is undefined or null
        return <div></div>;
      }

    // empty data
    if (!data["Gemini Result"]) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                <p className="text-lg text-red-600">Unable to parse the output from Gemini.</p>
            </div>
        );
    }
    // data with invalid api key response
    if (data["Gemini Result"] == "Invalid API key. Please pass a valid API key.") {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                <p className="text-lg text-red-600">Invalid API key. Please pass a valid API key.</p>
            </div>
        );
    }

    let { result } = data["Gemini Result"];
    
    let cleanedJsonString = "";
    if (result === undefined)
    {
        try
        {
            console.warn("Invalid json response, trying to parsing with javascript");
            cleanedJsonString = String(data["Gemini Result"]);
            cleanedJsonString = cleanedJsonString.replace("```json", "");
            cleanedJsonString = cleanedJsonString.replace("```", "");
            cleanedJsonString = cleanedJsonString.replace(/\n/g, ' ');
            
            // Step 2: Parse the JSON string
            const jsonObject = JSON.parse(cleanedJsonString);
            
            result = jsonObject["result"]
        }
        catch (e)
        {
            result = undefined
            console.error(e);
        }
        
    }
    // if (typeof data === String )
    // {
    //     return (
    //         <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
    //             <p className="text-lg text-red-600">Inavlid json response, here is the raw text</p>
    //             <p className="text-gray-600">{data}</p>
    //         </div>
    //     );
    // }

    // if (typeof result === undefined)
    // {
    //     return (
    //         <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
    //             <p className="text-lg text-red-600">Inavlid json response, here is the raw text</p>
    //             <p className="text-gray-600">{cleanedJsonString}</p>
    //         </div>
    //     );
    // }

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
            {result ?  
        (<div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                <h2 className="text-xl font-semibold text-gray-700">Line-by-Line Analysis</h2>
                <ul className="list-disc list-inside pl-5 space-y-4">
                    {result.Analysis.map((line, index) => (
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
                    {result.experience_required.map((exp, index) => (
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
                <p className="text-gray-600">{result.sponosorship_status}</p>
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
            )
            :
        (
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gemini Result Analysis</h1>
                <p className="text-lg text-red-600">Inavlid json response, here is the raw text</p>
                <p className="text-gray-600">{cleanedJsonString}</p>
            </div>
        )
            }

        </div>
    );
};

export default ResultComponent;