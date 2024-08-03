import React from 'react';

function JobListing({ job }) {
    return (
      <div>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleDateString()}</p>
        <p><strong>Salary:</strong> {job.currency} {job.min_amount} - {job.max_amount} per {job.interval}</p>
        <p><strong>Remote:</strong> {job.is_remote ? 'Yes' : 'No'}</p>
        <p><strong>Job Type:</strong> {job.job_type}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <a href={job.job_url} target="_blank" rel="noopener noreferrer">View Job Posting</a>
      </div>
    );
  }

export default JobListing;