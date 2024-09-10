import React from 'react';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function JobListing({ job }) {
  const [hover, setHover] = useState(false);
  const sanitizedDescription = DOMPurify.sanitize(job.description);

  const handleLinkClick = () => {
    window.open(job.job_url, '_blank', 'noopener,noreferrer');
  };

  // Determine color based on Similarity_score_Gensim
  const getScoreColor = (score) => {
    if (score >= 50) return 'text-green-500';    // High similarity
    if (score >= 25) return 'text-yellow-500';   // Moderate similarity
    return 'text-red-500';                       // Low similarity
  };

  
  let final_score = ((job.Similarity_score_Gensim + job.similarity_CountVector + 
                    job.similarity_TdfVector + job.similarity_sentenceTransformer +
                  job.similarity_matched_keywords + job.similarity_matched_keywords_cosine)/6).toFixed(2);

  if (final_score == 0)
  {
    final_score = "Upload Resume to check similarity score";
  }

  const scoreColor = getScoreColor(final_score);

  return (
    <div className='bg-white rounded-xl shadow-md relative m-8'>
      <div className='p-4'>
        {/* Logo and Title */}
        <div className='flex items-start mb-6'>
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
              className='h-20 w-20 object-contain mr-4' 
            />
             </a>
          )}
          <div>
          <a 
              href={job.job_url_direct == ''?  job.job_url : job.job_url_direct} 
              target='_blank' 
              rel='noopener noreferrer'
              className='text-xl font-bold text-indigo-700 hover:underline'
            >
              {job.title}
            </a>
            <a 
            href={job.company_url_direct  || job.company_url} 
            target='_blank' 
            rel='noopener noreferrer'
            className='mr-4'
          >
            <p className='text-gray-600 mt-2'><strong>Company: </strong>{job.company}</p>
          </a>
            
          </div>
        </div>
        <div className='mb-6'>
          <div className='border border-gray-100 mb-5'></div>
          <p><strong>Remote:</strong> {job.is_remote ? 'Yes' : 'No'}</p>
          <p><strong>Source:</strong> {job.site}</p>
          <p><strong>Type:</strong> {job.job_type} </p>
          <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleDateString()}</p>
        </div>
        <div 
            className='mb-6 relative'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className={`font-bold ${scoreColor}`}>
              <p><strong>Similarity Score:</strong> {final_score}</p>
            </div>

            {hover && (
              <div className="absolute left-1/2 bottom-full mb-2 p-4 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-lg transform -translate-x-1/2">
                <p>Doc2Vec Genism: {job.Similarity_score_Gensim}</p>
                <p>Count Vectorization: {job.similarity_CountVector}</p>
                <p>TFIDF Vectorization: {job.similarity_TdfVector}</p>
                <p>SentenceTransformer: {job.similarity_sentenceTransformer}</p>
                <p>Keywords comparison: {job.similarity_matched_keywords}</p>
                <p>Keywords comparison (cosine): {job.similarity_matched_keywords_cosine}</p>
              </div>
            )}
          </div>
        <div className='border border-gray-100 mb-5'></div>
        <div className='mb-5 h-96 overflow-y-auto'>
          <div
            className='text-sm'
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        <h3 className='text-indigo-500 mb-2'> {job.currency} {job.min_amount} - {job.max_amount} per {job.interval}</h3>

        <div className='border border-gray-100 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='text-orange-700 mb-3'>
            <FaMapMarker className='inline text-lg mb-1 mr-1' />
            {job.location}
          </div>
          
          <button
            onClick={handleLinkClick}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            View Job Posting
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobListing;