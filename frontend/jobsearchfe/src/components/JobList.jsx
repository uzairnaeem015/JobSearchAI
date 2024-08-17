import React from 'react';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function JobListing({ job }) {
  
  const sanitizedDescription = DOMPurify.sanitize(job.description);

  const handleLinkClick = () => {
    window.open(job.job_url, '_blank', 'noopener,noreferrer');
  };

  // Determine color based on Similarity_score_Gensim
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';    // High similarity
    if (score >= 40) return 'text-yellow-500';   // Moderate similarity
    return 'text-red-500';                       // Low similarity
  };
  const scoreColor = getScoreColor(job.Similarity_score_Gensim);

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
        <div className='mb-6'>
          <div className={`font-bold ${scoreColor}`}>
            <p><strong>Similarity Score (Cosine):</strong> {job.Similarity_score_Gensim}</p>
          </div>
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