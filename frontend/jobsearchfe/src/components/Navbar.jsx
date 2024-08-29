import React, { useState } from 'react';
import { NavLink, useNavigate  } from 'react-router-dom';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import { useEmailGlobalVariable, useNameGlobalVariable , useClearGlobalVariables } from './GlobalVariables'; // Import hooks

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email] = useEmailGlobalVariable('email', ''); // Ensure default value is provided
  const [name] = useNameGlobalVariable('name', ''); // Ensure default value is provided
  const clearGlobalVariables = useClearGlobalVariables(); // Hook to clear global variables
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const handleLogout = () => {
    clearGlobalVariables();
    setIsModalOpen(false);
    setIsDropdownOpen(false); // Hide dropdown
    navigate('/home'); // Redirect to the main page
    window.location.reload(); // Refresh the page
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <nav className='fixed z-50 w-full bg-indigo-800 border-b border-indigo-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/home'>
              <img className='h-10 w-auto' src={logo} alt='Search jobs AI' />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                Search Jobs AI
              </span>
            </NavLink>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <NavLink to='/home' className={linkClass}>
                  Home
                </NavLink>
                <NavLink to='/jobScoreDetail' className={linkClass}>
                  Job score details with AI 
                </NavLink>
                <NavLink to='/about' className={linkClass}>
                  About
                </NavLink>
                <div className='relative'>
                <button 
                    onClick={() => {
                      if (email) {
                        // Toggle dropdown visibility if logged in
                        setIsDropdownOpen(!isDropdownOpen);
                        setIsModalOpen(false); // Close modal if open
                      } else {
                        // If not logged in, open AuthModal
                        setIsDropdownOpen(false); // Close dropdown if open
                        setIsModalOpen(true);
                      }
                    }}
                    className={`flex items-center text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                  >
                    {email ? name || email : 'Guest'}
                  </button>
                  {email && isDropdownOpen && (
                    <div className='absolute right-0 mt-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                      <button 
                        onClick={handleLogout}
                        className='block px-4 py-2  text-gray-700 hover:bg-gray-100 w-full text-left'
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;
