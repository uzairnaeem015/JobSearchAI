import { useEffect , useRef  } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from '../components/Hero';
// import HomeCards from '../components/HomeCards';
import JobListings from '../components/JobListings';
// import ViewAllJobs from '../components/ViewAllJobs';

const HomePage = () => {
  const isMounted = useRef(false);
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (isMounted.current) return;

    const checkServerStatus = async () => {
      const source = axios.CancelToken.source();

      // Timeout for 5 seconds
      const timeout = setTimeout(() => {
        source.cancel();
      }, 5000);

      try {
        
        await axios.get(api_url, { cancelToken: source.token });
        clearTimeout(timeout);
        toast.success( "Backend server is running at: "  + api_url, {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {   
        toast.warn("Firing up the backend server, it is deployed on Render.com on free tier, it will take some time to load, Please visit \""+ api_url + "\" to verify it's running.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    checkServerStatus();
    isMounted.current = true;
  }, []);

  return (
    <>
      <Hero />
      {/* <HomeCards /> */}
      <JobListings isHome={true} />
      {/* <ViewAllJobs /> */}
      <ToastContainer />
    </>
  );
};

export default HomePage;
