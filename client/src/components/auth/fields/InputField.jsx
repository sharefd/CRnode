const InputField = ({ field, value, onChange, error }) => (
  <div className='mb-4'>
    <label className='block text-sm font-medium text-gray-600'>{field.label}</label>
    <input
      type={field.type}
      name={field.name}
      className='mt-1 p-2 w-full rounded-md border'
      required={field.required}
      value={value}
      onChange={onChange}
    />
    {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
  </div>
);

export default InputField;
