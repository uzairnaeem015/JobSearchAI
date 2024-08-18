import React from 'react';

const About = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-5 text-center">About This Project</h1>
      <p className="text-base text-gray-800 mb-4 leading-relaxed">
        This tool simplifies the job application process by providing similarity scores between job descriptions and resumes. It utilizes Google Gemini to offer personalized suggestions on how to improve your resume, aiming to enhance alignment with job postings. The project addresses the challenge of efficiently optimizing resumes and serves as a free, effective alternative to paid tools.
      </p>
      <p className="text-base text-gray-800 mb-4 leading-relaxed">
        The tool uses a variety of NLP techniques to calculate similarity scores, including Cosine Similarity, Euclidean Distance, Doc2Vec, CountVectorizer, TF-IDF Vectorizer, and Sentence Similarity with BERT. Google Gemini is utilized to generate valuable resume improvement suggestions.
      </p>
      <p className="text-base text-gray-800 mb-6 leading-relaxed">
        For more details, visit the project's GitHub repository:
      </p>
      <div className="flex justify-center ">
        <a
          href="https://github.com/uzairnaeem015/JobSearchAI"
          className="inline-block px-5 py-2 text-white   bg-indigo-500  hover:bg-indigo-600 rounded-md text-base font-medium transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit on GitHub
        </a>
      </div>
    </div>
  );
};

export default About;
