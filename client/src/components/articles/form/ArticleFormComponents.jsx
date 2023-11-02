import { Button, Input, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

export const TextAreaField = ({ placeholder, value, onChange }) => (
  <div className='mb-4 group'>
    <label className='block text-xs font-small text-gray-700 group-focus-within:text-bluebrand'>Details</label>
    <TextArea
      placeholder={placeholder}
      className='w-full p-1 border rounded focus:border-bluebrand'
      rows={3}
      value={value}
      onChange={onChange}
    />
  </div>
);

export const InputField = ({ label, value, onChange, placeholder }) => (
  <div className='mb-4 group'>
    <label className={`block text-xs font-small text-gray-700 group-focus-within:text-bluebrand`}>{label}</label>
    <Input placeholder={placeholder} value={value} onChange={onChange} />
  </div>
);

export const SelectField = ({ field, value, onChange, error }) => (
  <div className='mb-4 group'>
    <label className='block text-xs font-small text-gray-600 group-focus-within:text-bluebrand'>{field.label}</label>
    <Select name={field.name} value={value} onChange={onChange}>
      {field.choices &&
        field.choices.map((choice, i) => (
          <Select.Option key={i} value={choice.value}>
            {choice.label}
          </Select.Option>
        ))}
    </Select>
    {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
  </div>
);

export const SubmitButton = ({ label }) => (
  <div className='text-center'>
    <Button type='primary' htmlType='submit'>
      {label}
    </Button>
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
