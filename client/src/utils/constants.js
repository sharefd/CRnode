export const PURPOSE_CHOICES = {
  OM1: 'OM Half-day',
  UOFTAMR: 'UofT Aerospace Rounds',
  MACIMAHD1: 'McMaster IM PGY-1 AHD',
  MACIMAHD2: 'McMaster IM PGY-2 AHD',
  MACIMAHD3: 'McMaster IM PGY-3 AHD'
};

export const PURPOSE_MAPPINGS = {
  OM1: 'Uoft OM Half-day',
  UOFTAMR: 'UofT Aerospace',
  MACIMAHD1: 'McM Im AHD',
  MACIMAHD2: 'McM Im AHD',
  MACIMAHD3: 'McM Im AHD'
};

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
  { label: 'Create Article', endpoint: '/articles/new' },
  { label: 'Manage Requests', endpoint: '/requests' },
  { label: 'My Rounds', endpoint: '/articles' },
  { label: 'Past Rounds', endpoint: '/older-articles' },
  { label: 'Rounds Catalog', endpoint: '/requests/new' }
];

export const userlinks = [
  { label: 'My Rounds', endpoint: '/articles' },
  { label: 'Past Rounds', endpoint: '/older-articles' },
  { label: 'Rounds Catalog', endpoint: '/requests/new' }
];
