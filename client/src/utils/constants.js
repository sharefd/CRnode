import { EventAvailable, History, Key, ManageSearch, PeopleAlt, Settings } from '@mui/icons-material';
import { SettingOutlined } from '@ant-design/icons';

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
    label: 'Manage',
    Icon: PeopleAlt,
    endpoint: '/manage',
    description: 'Create and manage and view calendar permissions.'
  },

  {
    label: 'Calendar',
    Icon: EventAvailable,
    endpoint: '/calendar',
    description: 'Access your events. Includes a calendar view.'
  },
  {
    label: 'Requests',
    Icon: Key,
    endpoint: '/requests',
    description: 'View and manage incoming calendar requests.'
  },
  {
    label: 'Past Rounds',
    Icon: History,
    endpoint: '/past-events',
    description: 'Review past articles and provide optional feedback.'
  }
];

export const homeLinks = [
  {
    label: 'Step 1: Manage',
    Icon: PeopleAlt,
    endpoint: '/manage',
    description: 'Create a calendar. Select or invite users to view your calendar.'
  },
  {
    label: 'Step 2: Calendar',
    Icon: EventAvailable,
    endpoint: '/calendar',
    description: 'View and create events. See your calendar in action.'
  },
  {
    label: 'Step 3: Requests',
    Icon: Key,
    endpoint: '/requests',
    description: 'View and manage incoming calendar requests.'
  }
  //     {
  //     label: 'Past Events',
  //     Icon: History,
  //     endpoint: '/past-events',
  //     description: 'Review past articles and provide optional feedback.'
  //   },
  // {
  //   label: 'Rounds Catalog',
  //   Icon: ManageSearch,
  //   endpoint: '',
  //   description: 'Coming soon.'
  // },
  // {
  //   label: 'Account Settings',
  //   Icon: Settings,
  //   endpoint: '/settings',
  //   description: 'Manage your account settings.'
  // }
];

// Apply CSS styles to achieve a vertical layout
homeLinks.forEach(link => {
  link.containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  link.labelStyle = {
    fontWeight: 'bold'
  };

  link.descriptionStyle = {
    textAlign: 'center'
  };
});

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
  meetingType: 'Virtual',
  organizer: ''
};
