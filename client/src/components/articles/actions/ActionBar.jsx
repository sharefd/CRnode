import { useEffect, useState } from 'react';

const ActionBar = ({ selectedPurposes, setSelectedPurposes, toggleNewArticleModal, canReadPurposes }) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [currentTime, setCurrentTime] = useState(formattedTime);
  const [searchTerm, setSearchTerm] = useState('');

  const allowedPurposes = canReadPurposes.map(purpose => purpose.name);
  const filteredPurposes = allowedPurposes.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = purpose => {
    let newPurposes = [...selectedPurposes];
    if (newPurposes.includes(purpose)) {
      newPurposes = newPurposes.filter(p => p !== purpose);
    } else {
      newPurposes.push(purpose);
    }
    setSelectedPurposes(newPurposes);
  };

  const toggleAll = () => {
    if (selectedPurposes.length === allowedPurposes.length) {
      setSelectedPurposes([]);
    } else {
      setSelectedPurposes(allowedPurposes);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative flex w-full'>
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`absolute top-3 w-7 h-7 rounded-full bg-white shadow hover:bg-blue-700 ${
          showSidebar ? 'left-48' : 'left-4'
        }`}>
        {showSidebar ? (
          <svg width='16' height='12' fill='currentColor' viewBox='0 0 4 16'>
            <path
              fillRule='evenodd'
              d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
            />
          </svg>
        ) : (
          <svg width='16' height='12' fill='currentColor' viewBox='0 0 1 16'>
            <path
              fillRule='evenodd'
              d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
            />
          </svg>
        )}
      </button>
      {showSidebar && (
        <div className='flex'>
          <div className='w-48 h-screen bg-gray-200 fixed top-18 left-0 overflow-y-auto z-10'>
            <div className='p-4 w-48'>
              <input
                type='text'
                placeholder='Search...'
                className='w-full p-2 mb-4 border rounded'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button onClick={toggleAll} className='w-40 p-2 mb-4 bg-blue-500 text-white rounded'>
                {selectedPurposes.length === allowedPurposes.length ? 'Deselect All' : 'Select All'}
              </button>
              {filteredPurposes.map(purpose => (
                <div key={purpose} className='flex items-center p-2 hover:bg-gray-300'>
                  <input
                    type='checkbox'
                    checked={selectedPurposes.includes(purpose)}
                    onChange={() => handleToggle(purpose)}
                    className='mr-2'
                  />
                  <span>{purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className='flex justify-end items-center w-full px-4 mb-5 bg-gray-100'>
        <div className='flex justify-end items-center w-full px-4 my-3.5 bg-gray-100'>
          <button
            className='flex items-center bg-bluebrand text-white hover:bg-blue-500 px-4 py-1 rounded'
            onClick={toggleNewArticleModal}>
            + Create Event
          </button>
          <p className='text-gray-600 text-sm ml-5'>{currentTime}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
