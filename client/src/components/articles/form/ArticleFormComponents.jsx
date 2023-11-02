export const TextAreaField = ({ placeholder, value, onChange }) => (
  <div className='mb-4 group'>
    <label className='block text-xs font-small text-gray-700 group-focus-within:text-bluebrand'>Details</label>
    <textarea
      placeholder={placeholder}
      className='w-full p-1 border rounded focus:border-bluebrand'
      rows='3'
      value={value}
      onChange={onChange}></textarea>
  </div>
);

export const InputField = ({ label, value, onChange, placeholder, classes }) => (
  <div className={`mb-4 ${classes} group`}>
    <label className={`block text-xs font-small text-gray-700 group-focus-within:text-bluebrand`}>{label}</label>
    <input
      type='text'
      placeholder={placeholder}
      className='w-full p-1 border-b border-gray-300 outline-none focus:border-bluebrand'
      value={value}
      onChange={onChange}
    />
  </div>
);

export const SelectField = ({ field, value, onChange, error, classes }) => (
  <div className={`mb-4 group`}>
    <label className='block text-xs font-small text-gray-600 group-focus-within:text-bluebrand'>{field.label}</label>
    <select
      name={field.name}
      className={`${classes} border-b mt-2.5 outline-none focus:border-bluebrand`}
      required={field.required}
      value={value}
      onChange={onChange}>
      {field.choices &&
        field.choices.map((choice, i) => (
          <option key={i} value={choice.value}>
            {choice.label}
          </option>
        ))}
    </select>
    {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
  </div>
);

export const SubmitButton = ({ label }) => (
  <div className='text-center bg-blue-600 rounded-md hover:bg-blue-500'>
    <button type='submit' className='text-white px-4 py-2 w-28'>
      {label}
    </button>
  </div>
);

export const meetingTypeField = {
  name: 'meetingType',
  label: 'Meeting Type',
  required: true,
  choices: [
    { label: 'Virtual', value: 'Virtual' },
    { label: 'In-Person', value: 'In-Person' },
    { label: 'Hybrid', value: 'Hybrid' }
  ]
};
