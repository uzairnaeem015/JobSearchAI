import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Navbar always at the top */}
      <main className="flex-1">
        <Outlet /> {/* Renders the page-specific content */}
      </main>
    </div>
  );
};
export default MainLayout;
