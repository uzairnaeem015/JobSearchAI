import React from 'react';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function JobListing({ job }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = job.description;
  // const sanitizedDescription = DOMPurify.sanitize(description);
  if (!showFullDescription) {
    description = description.substring(0, 300) + '...';
  }


  return (
    // <div className='bg-white rounded-xl shadow-md relative'>
    //   <div className="sidebar">
    //     <h2>{job.title}</h2>
    //     <p><strong>Company:</strong> {job.company}</p>
    //     <p><strong>Location:</strong> {job.location}</p>
    //     <p><strong>Remote:</strong> {job.is_remote ? 'Yes' : 'No'}</p>
    //     <p><strong>Job Type:</strong> {job.job_type}</p>
    //     <p><strong>Source:</strong> {job.site}</p>
    //   </div>
    //   <div className="main-content">
    //     <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleDateString()}</p>
    //     <p><strong>Salary:</strong> {job.currency} {job.min_amount} - {job.max_amount} per {job.interval}</p>
    //     <p><strong>Description:</strong> {job.description}</p>
    //     <a href={job.job_url} target="_blank" rel="noopener noreferrer">View Job Posting</a>
    //   </div>
    // </div>
    <div className='bg-white rounded-xl shadow-md relative'>
      <div className='p-4'>
        <div className='mb-6'>
          <div className='text-gray-600 my-2'>{job.job_type}</div>
          <h3 className='text-xl font-bold'>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Remote:</strong> {job.is_remote ? 'Yes' : 'No'}</p>
          <p><strong>Source:</strong> {job.site}</p>
          <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleDateString()}</p>
        </div>
        <div className='mb-6'>
          <p><strong>Score:</strong> {job.Similarity_score_Gensim}</p>
        </div>
        <div className='mb-5'>{description}</div>
        {/* <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} /> */}
        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className='text-indigo-500 mb-5 hover:text-indigo-600'
        >
          {showFullDescription ? 'Less' : 'More'}
        </button>

        <h3 className='text-indigo-500 mb-2'> {job.currency} {job.min_amount} - {job.max_amount} per {job.interval}</h3>

        <div className='border border-gray-100 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='text-orange-700 mb-3'>
            <FaMapMarker className='inline text-lg mb-1 mr-1' />
            {job.location}
          </div>
          <Link
            to={job.job_url}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            View Job Posting
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobListing;