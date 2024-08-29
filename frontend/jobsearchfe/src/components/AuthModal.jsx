import React, { useState } from 'react';
import { useEmailGlobalVariable, useNameGlobalVariable, useHashPasswordGlobalVariable } from './GlobalVariables'; // Import hooks for global variables
import CryptoJS from "crypto-js";

const AuthModal = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useEmailGlobalVariable(); // Hook for global email
  const [name, setName] = useNameGlobalVariable(); // Hook for global name
  const [encryptedPassword, setEncryptedPassword] = useHashPasswordGlobalVariable(); // Hook for global name
  const [password, setPassword] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [userNameLocal, setUserNameLocal] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordEncryption = (password) => {
    // Encrypt the password
    const encrypted = CryptoJS.SHA256(password).toString();
    
    // Save it in a local variable (state in this case)
    setPassword(encrypted);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const api_url = import.meta.env.VITE_API_URL;
    const endpoint = isSignUp ? '/sign_up' : '/login'; // API endpoints
    const formData = new FormData();
    formData.append('email', emailLocal);
    formData.append('password', password);

    if (isSignUp) {
      formData.append('username', userNameLocal); // Only append username for sign-up
    }

    try {
      const response = await fetch(api_url + endpoint, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);

      if (result.Result.Success) {
        // Update global variables and close the modal
        setEmail(result.Result.Email);
        setName(result.Result.Name);
        setEncryptedPassword(password);
        
        // Optionally, reload the page after successful login/sign-up
        window.location.reload();
        //
      } else {
        alert(result.Result.Message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to authenticate.');
    } finally {
      setLoading(false);
      
    }
  };
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-80">
        <h2 className="text-lg font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={userNameLocal}
                onChange={(e) => setUserNameLocal(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              //value={password}
              onChange={(e) => handlePasswordEncryption(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
