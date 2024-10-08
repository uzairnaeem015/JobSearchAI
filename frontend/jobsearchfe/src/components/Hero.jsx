const Hero = ({
    title = 'Search jobs with AI',
    subtitle = 'Upload your resume and search with job title, we will filter the jobs that matches your resume using cutting-edge AI models',
  }) => {
    return (
      <section className='bg-indigo-700 py-16 mb-4 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
              {title}
            </h1>
            <p className='my-4 text-xl text-white'>{subtitle}</p>
          </div>
        </div>
      </section>
    );
  };
  export default Hero;
  