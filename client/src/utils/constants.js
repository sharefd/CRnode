import { EventAvailable, History, Key, ManageSearch, PeopleAlt } from '@mui/icons-material';

export const UNIVERSITY_CHOICES = [
  { value: '', label: 'Select University' },
  { value: 'McMaster', label: 'McMaster University' },
  { value: 'Toronto', label: 'University of Toronto' },
  { value: 'Western', label: 'University of Western Ontario' },
  { value: 'Ottawa', label: 'Ottawa University' },
  { value: 'Queens', label: "Queen's University" },
  { value: 'Other', label: 'Other' }
];

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
  'CC4',
  'Other'
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
    label: 'Manage Calendars',
    type: 'fa',
    Icon: PeopleAlt,
    endpoint: '/calendars',
    description: 'Create, manage and view calendar permissions.'
  },
  {
    label: 'Manage Requests',
    Icon: Key,
    endpoint: '/requests',
    description: 'View and manage incoming calendar requests.'
  },
  {
    label: 'My Calendar',
    Icon: EventAvailable,
    endpoint: '/articles',
    description: 'Access your events. Includes a calendar view.'
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

export const initialArticleData = {
  title: '',
  event_link: '',
  date: new Date(),
  duration: '',
  purpose: '',
  meeting_id: '',
  passcode: '',
  speaker: '',
  additional_details: '',
  location: '',
  meetingType: 'virtual'
};
