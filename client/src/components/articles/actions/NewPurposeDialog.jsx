const NewPurposeDialog = ({
  showAddPurposeModal,
  setShowAddPurposeModal,
  setNewPurpose,
  newPurpose,
  handleAddPurpose
}) => {
  return (
    <div className={showAddPurposeModal ? 'fixed inset-0 flex items-center justify-center z-50' : 'hidden'}>
      <div className='bg-white p-4 rounded'>
        <h3 className='text-lg font-semibold'>Add New Purpose</h3>
        <div className='mt-4'>
          <input
            type='text'
            placeholder='Purpose Name'
            className='w-full p-2 border rounded'
            value={newPurpose.name}
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
        </div>
        <div className='mt-4'>
          <input
            type='text'
            placeholder='Description'
            className='w-full p-2 border rounded'
            value={newPurpose.description}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
        </div>
        <div className='flex justify-end mt-4'>
          <button
            className='bg-red-500 text-white px-4 py-2 rounded mr-2'
            onClick={() => setShowAddPurposeModal(false)}>
            Cancel
          </button>
          <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleAddPurpose}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewPurposeDialog;
