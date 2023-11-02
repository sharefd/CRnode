import { useState } from 'react';

const DropdownMenu = ({ options, selectedOption, setSelectedOption, color = 'bg-blue-700', label = '' }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = e => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const selectOption = (e, option) => {
    setSelectedOption(option);
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='mb-3 w-sm'>
      {label && <label className='block text-sm font-medium text-gray-600 mb-2'>{label}</label>}
      <button
        onClick={e => toggleDropdown(e)}
        className={`text-white ${color} hover:${color}-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center`}>
        {selectedOption}
        <svg
          className='w-2.5 h-2.5 ml-2'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 10 6'>
          <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 4 4 4-4' />
        </svg>
      </button>
      {showDropdown && (
        <div className='absolute mt-2 w-sm bg-white border border-gray-200 rounded shadow-lg z-10'>
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <button
                  type='button'
                  onClick={e => selectOption(e, option)}
                  className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200'>
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
