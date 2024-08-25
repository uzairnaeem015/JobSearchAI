import React, { useState } from 'react';
import JobScoreDetail from '../components/JobScoreDetailsWithAI';
import HistoryList from '../components/ScoreHistory';
import ResultComponent from "../components/ScoreDetailResponse";

const JobsScoreDetailPage = () => {
  const [responseData, setData] = useState();

  const handleSelect = async (item) => {
    const formData = new FormData();
    formData.append("id", item.score_id);

    try {
      const api_url = import.meta.env.VITE_API_URL;
      const apiUrl = `${api_url}/get_selected_job_score`;

      // Await the fetch response and parse JSON
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null); // Optionally handle errors
    }
  };

  return (
    <section className='bg-blue-50 px-4 py-6'>
      <HistoryList onSelect={handleSelect} />
      <JobScoreDetail  />
      <ResultComponent data={responseData}/>
    </section>
  );
};

export default JobsScoreDetailPage;
