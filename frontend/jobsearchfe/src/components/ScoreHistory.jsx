// HistoryList.js
import React, { useState, useEffect } from 'react';

const HistoryList = ({ onSelect }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    };


  useEffect(() => {

    const formData = new FormData();
      formData.append("email", "uzairnaeem15@gmail.com");

    // Fetch list items from the backend
    const fetchItems = async () => {
        const api_url = import.meta.env.VITE_API_URL;
        const apiUrl = api_url + '/get_job_score_history_list';
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData
          });
    
        const data = await response.json();
        console.log(data);
        setItems(data["result"]);
    };
    fetchItems();
  }, []);

  return (
    <div>
        <label className='block text-gray-700 font-bold mb-2'>
        Email
        </label>
        <input
        placeholder="Enter email to save history"
        type="email"
        value={email}
        onChange={handleEmailChange}
        className='border rounded w-full py-2 px-3 mb-2'
        />
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        History
      </button>
      {isOpen && items &&  (
        <ul className="mt-2 border border-gray-200 rounded">
          {items.map((item) => (
            <li 
              key={item.score_id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {item.datetime} - {item.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryList;
