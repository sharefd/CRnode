const SelectField = ({ field, value, onChange, error, border = true, classes }) => (
  <div className={`mb-4`}>
    <label className='block text-sm font-medium text-gray-600'>{field.label}</label>
    <select
      name={field.name}
      className={` ${border ? 'w-full border rounded-md mt-1 p-2 ' : `${classes} border-b mt-2.5 outline-none`}`}
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

export default SelectField;
