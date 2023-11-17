import { useState } from 'react';

export const ArticleFilters = ({ canReadPurposes, selectedPurposes, setSelectedPurposes }) => {
  const [open, setOpen] = useState(false);
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

  return (
    <div className='flex' 
      {open && (
        <div className='w-64 h-screen bg-gray-200 fixed top-0 right-0 overflow-y-auto'>
          <div className='p-4'>
            <input
              type='text'
              placeholder='Search...'
              className='w-full p-2 mb-4 border rounded'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={toggleAll} className='w-full p-2 mb-4 bg-blue-500 text-white rounded'>
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
      )}
    </div>
  );
};
