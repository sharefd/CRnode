export const UNIVERSITY_CHOICES = [
  { value: '', label: 'Select University' },
  { value: 'McMaster', label: 'McMaster University' },
  { value: 'Toronto', label: 'University of Toronto' },
  { value: 'Western', label: 'University of Western Ontario' },
  { value: 'Ottawa', label: 'Ottawa University' },
  { value: 'Queens', label: "Queen's University" },
  { value: 'Other', label: 'Other' }
];

export const loginFields = [
  { name: 'username', label: 'Username or Email', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true }
];

export const signupFields = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'university', label: 'University', type: 'select', required: true, choices: UNIVERSITY_CHOICES },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'passwordConfirmation', label: 'Confirm Password', type: 'password', required: true }
];
