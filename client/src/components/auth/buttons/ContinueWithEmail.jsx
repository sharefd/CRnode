const ContinueWithEmail = ({ showForm, setShowForm }) => {
  return (
    <div className='px-6 sm:px-8 max-w flex justify-center items-center dark:bg-gray-800 py-2'>
      <button
        onClick={() => setShowForm(!showForm)}
        className='w-full border gap-2 border-slate-200 dark:border-slate-700  text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2'>
        <span> Continue With Email</span>
      </button>
    </div>
  );
};

export default ContinueWithEmail;
