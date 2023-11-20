import { EventAvailable, History, Key, ManageSearch, PeopleAlt, Settings } from '@mui/icons-material';
import { SettingOutlined } from '@ant-design/icons';

export const UNIVERSITY_CHOICES = [
  { value: '', label: 'Select University' },

  { value: 'McMaster University', label: 'McMaster University' },
  { value: 'University of Toronto', label: 'University of Toronto' },
  { value: 'University of Western Ontario', label: 'University of Western Ontario' },
  { value: 'University of Ottawa', label: 'University of Ottawa' },
  { value: 'Queens University', label: "Queen's University" },

  { value: 'Dalhousie University', label: 'Dalhousie University' },
  { value: 'McGill University', label: 'McGill University' },

  { value: 'University of Manitoba', label: 'University of Manitoba' },
  { value: 'University of Saskatchewan', label: 'University of Saskatchewan' },
  { value: 'University of Calgary', label: 'University of Calgary' },
  { value: 'University of Alberta', label: 'University of Alberta' },
  { value: 'University of British Columbia', label: 'University of British Columbia' },

  { value: 'Université de Montréal', label: 'Université de Montréal' },
  { value: 'Northern Ontario School of Medicine University', label: 'Northern Ontario School of Medicine University' },

  { value: 'Other', label: 'Other' }
];

export const domainSuggestions = [
  'mail.utoronto.ca',
  'utoronto.ca',
  'medportal.ca',
  'mcmaster.ca',
  'mcgill.ca',
  'ualberta.ca',
  'uwo.ca',
  'meds.uwo.ca',
  'queensu.ca',
  'uba.ca',
  'uottawa.ca',
  'dal.ca',
  'queensu.ca',
  'mail.ubc.ca',
  'ahs.ca',
  'albertahealthservices.ca',
  'usask.ca',
  'saskhealthauthority.ca',
  'umanitoba.ca',
  'hsc.mb.ca',
  'exchange.hsc.mb.ca',
  'nosm.ca',
  'umontreal.ca'
];

export const universityDomainMap = {
  'Dalhousie University': ['dal.ca'],
  'Ottawa University': ['uottawa.ca'],
  'McGill University': ['mcgill.ca'],
  'McMaster University': ['mcmaster.ca', 'medportal.ca'],
  'University of Toronto': ['mail.utoronto.ca', 'utoronto.ca'],
  'University of Western Ontario': ['uwo.ca', 'meds.uwo.ca'],
  'University of Manitoba': ['umanitoba.ca'],
  'University of British Columbia': ['ubc.ca', 'mail.ubc.ca'],
  'Queens University': ['queensu.ca'],
  'University of Calgary': ['ahs.ca', 'albertahealthservices.ca'],
  'University of Alberta': ['ualberta.ca'],
  'University of Saskatchewan': ['usask.ca', 'saskhealthauthority.ca'],
  'University of Manitoba': ['umanitoba.ca', 'hsc.mb.ca', 'exchange.hsc.mb.ca'],
  'Northern Ontario School of Medicine University': ['nosm.ca'],
  'Université de Montréal': ['umontreal.ca'],

  Other: []
};

export const genericDomains = ['gmail.com'];

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

export const sideMenuLinks = [
  ...navlinks,
  {
    label: 'Settings',
    Icon: Settings,
    endpoint: '/settings',
    description: 'Manage your account settings.'
  }
];

export const homeLinks = [
  {
    label: 'Step 1: Manage',
    Icon: PeopleAlt,
    endpoint: '/manage',
    description: "Create a calendar in the Manage tab. Select or invite users to view your calendar."
  },
  {
    label: 'Step 2: Calendar',
    Icon: EventAvailable,
    endpoint: '/calendar',
    description: 'Create events in the Calendar tab. See your calendar in action.'
  },
//  {
//    label: 'Step 3: Requests',
//    Icon: Key,
//    endpoint: '/requests',
//    description: 'View and manage incoming calendar requests.'
//  }
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
