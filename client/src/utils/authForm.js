import { PURPOSE_CHOICES } from './constants';

export const UNIVERSITY_CHOICES = [
  { value: '', label: 'Select University' },
  { value: 'McMaster', label: 'McMaster University' },
  { value: 'Toronto', label: 'University of Toronto' },
  { value: 'Western', label: 'University of Western Ontario' },
  { value: 'Ottawa', label: 'Ottawa University' },
  { value: 'Queens', label: "Queen's University" },
  { value: 'Other', label: 'Other' }
];

export const initialPermissions = Object.keys(PURPOSE_CHOICES).map(purpose => ({
  purpose,
  canRead: false,
  canWrite: false
}));
