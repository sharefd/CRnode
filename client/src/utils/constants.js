import { EventAvailable, History, Key, ManageSearch, MedicalServices, MoveToInbox } from '@mui/icons-material';
import PurposeIcon from '@/assets/images/purpose.svg';
import { FaBookMedical } from 'react-icons/fa';

export const PURPOSE_CHOICES = {
  OM1: 'OM Half-day',
  UOFTAMR: 'UofT Aerospace',
  MACIMAHD1: 'McMaster IM PGY-1 AHD',
  MACIMAHD2: 'McMaster IM PGY-2 AHD',
  MACIMAHD3: 'McMaster IM PGY-3 AHD'
};

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

export const YEAR_OF_STUDY_CHOICES = [
  'PGY1',
  'PGY2',
  'PGY3',
  'PGY4',
  'PGY5',
  'PGY6',
  'PGY7',
  'PGY8',
  'PGY9',
  'CC1',
  'CC2',
  'CC3',
  'CC4'
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const eventColors = ['#0056b3', '#2673FF', '#4D9BFF', '#80C7FF', '#B3E0FF'];

export const navlinks = [
  {
    label: 'Manage Purposes',
    type: 'fa',
    Icon: FaBookMedical,
    endpoint: '/purposes',
    description: 'Create, manage and view purposes permissions.'
  },
  {
    label: 'Manage Requests',
    Icon: Key,
    endpoint: '/requests',
    description: 'View and manage incoming permission requests.'
  },
  {
    label: 'My Rounds',
    Icon: EventAvailable,
    endpoint: '/articles',
    description: 'Access your articles and events. Includes a calendar view.'
  },
  {
    label: 'Past Rounds',
    Icon: History,
    endpoint: '/older-articles',
    description: 'Review past articles and provide optional feedback.'
  },
  {
    label: 'Rounds Catalog',
    Icon: ManageSearch,
    endpoint: '/requests/new',
    description: 'Explore public events and request access.'
  }
];
