import React, { useState, useEffect } from 'react';
import { useEmailGlobalVariable } from './GlobalVariables';

const HistoryList = ({ onSelect }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [emailGlobalVariable, setEmailGlobalVariable] = useEmailGlobalVariable('email', '');

  // Function to fetch items from the backend
  const fetchItems = async () => {
    if(emailGlobalVariable)
    {
      const formData = new FormData();
      formData.append("email", emailGlobalVariable);

      const api_url = import.meta.env.VITE_API_URL;
      const apiUrl = api_url + '/get_job_score_history_list';
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      //console.log(data);
      if (Array.isArray(data["result"])) {
        setItems(data["result"]);
      }
      else
      {
        setItems([]);
      }
  }
  };

  // Function to handle button click
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchItems(); // Fetch items only when the list is opened
    }
  };

  // Function to format the datetime
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div>
    {( emailGlobalVariable && <div className="absolute bg-gray-100 z-10">
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleButtonClick}
      >
        History
      </button>
      {isOpen && items && (
        <ul className="absolute left-0 w-64 mt-2 max-h-124 border border-gray-200 rounded bg-white z-10 overflow-y-auto">
          {items && items.map((item, index) => (
            <li  
              key={item.score_id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setIsOpen(false); // Close the list after selecting an item
              }}
            >
              {/* Display serial number, formatted datetime, and email */}
              {index + 1}: <strong>{item.model ? item.model : item.email}</strong> {formatDateTime(item.datetime)} 
            </li>
          ))}
        </ul>
      )}
    </div>
    )}
    </div>
  );
};

export default HistoryList;
