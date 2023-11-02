import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle, sortArticles, updateArticle, deleteArticle } from '@/services/articles';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createPurpose, fetchPurposes } from '@/services/purposes';
import MyDatePicker from './MyDatePicker';
import NewPurposeDialog from '../actions/NewPurposeDialog';
import { InputField, SelectField, TextAreaField, SubmitButton, meetingTypeField } from './ArticleFormComponents';
import { IconButton, Modal, Paper } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const initialArticleData = {
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

const NewArticleForm = ({
  open,
  onClose,
  refetchArticles,
  localArticles,
  setLocalArticles,
  selectedArticle,
  onSave,
  onDelete
}) => {
  const [allowedPurposes, setAllowedPurposes] = useState(null);
  const [showAddPurposeModal, setShowAddPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [article, setArticle] = useState(initialArticleData);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('12:00 PM');
  const [endTime, setEndTime] = useState('12:00 PM');

  const {
    data: purposes,
    isLoading,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', user._id], () => fetchPurposes(user._id));

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const canWrite = purposes?.filter(purpose => purpose.canWriteMembers.includes(user._id.toString())) || [];

    setAllowedPurposes(canWrite);
    if (canWrite.length > 0) {
      setArticle(prevArticle => ({ ...prevArticle, purpose: canWrite[0].name }));
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedArticle) {
      setArticle(selectedArticle);
    } else {
      setArticle(initialArticleData);
    }
  }, [selectedArticle]);

  const createMutation = useMutation(createArticle, {
    onSuccess: newArticle => {
      const allArticles = [...localArticles, newArticle];
      setLocalArticles(sortArticles(allArticles));
      refetchArticles();
      onClose();
    }
  });

  const handleSave = async e => {
    e.preventDefault();
    onSave(article);
  };

  const handleAddPurpose = async () => {
    const purposeData = {
      name: newPurpose.name,
      description: newPurpose.description,
      canReadMembers: [],
      canWriteMembers: []
    };
    const createdPurpose = await createPurpose(user._id, purposeData);
    setAllowedPurposes([...allowedPurposes, createdPurpose]);
    setNewPurpose({ name: '', description: '' });
    refetchPurposes();
    setShowAddPurposeModal(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    let eventLink = article.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const payload = {
      ...article,
      date: date,
      duration: `${startTime} - ${endTime}`,
      organizer: user._id,
      purpose: article.purpose ? article.purpose : allowedPurposes[0].name,
      event_link: eventLink // Update the event_link with the corrected URL
    };

    console.log(payload);

    if (!payload.title) {
      console.error('Title is required');
      return;
    }

    createMutation.mutate(payload);
  };

  if (!user || !allowedPurposes) {
    return <LoadingSpinner />;
  }

  const purposeField = {
    name: 'purpose',
    label: 'Purpose',
    required: true,
    choices: allowedPurposes.map(purpose => ({ label: purpose.description, value: purpose.name }))
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='new-article-modal-title'
      aria-describedby='new-article-modal-description'>
      <Paper elevation={3} className='relative overflow-y-auto max-w-lg mx-auto mt-20 max-h-[80vh]'>
        <div className='relative overflow-y-auto max-w-lg mx-auto'>
          <div style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>
            <div className='text-center text-white bg-blue-600 p-2.5 rounded-t relative'>
              Create Event
              <IconButton onClick={onClose} style={{ position: 'absolute', right: 1, top: 2 }}>
                <Close sx={{ color: '#fff', fontSize: '22px' }} />
              </IconButton>
            </div>
            <form onSubmit={selectedArticle ? handleSave : handleSubmit} className='p-6'>
              {/* TITLE */}
              <InputField
                label='Title'
                placeholder='Title'
                value={article.title}
                onChange={e => setArticle({ ...article, title: e.target.value })}
              />

              <div className='flex justify-between mb-3 pt-1'>
                {/* Purpose */}
                <SelectField
                  field={purposeField}
                  value={article.purpose}
                  onChange={e => setArticle({ ...article, purpose: e.target.value })}
                  error={null}
                  border={false}
                />

                {/* Speaker */}
                <InputField
                  label='Speaker'
                  placeholder='Speaker'
                  value={article.speaker}
                  onChange={e => setArticle({ ...article, speaker: e.target.value })}
                />
              </div>

              {/* DATE AND TIME */}
              <div className='mb-5 flex justify-between'>
                <MyDatePicker
                  article={selectedArticle}
                  setDate={setDate}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                />
              </div>

              <div className='flex justify-between mb-3 pt-1'>
                {/* VIRTUAL/IN-PERSON/Hybrid */}
                <SelectField
                  field={meetingTypeField}
                  value={article.meetingType}
                  onChange={e => setArticle({ ...article, meetingType: e.target.value })}
                  error={null}
                  border={false}
                  classes='w-28'
                />
                {article.meetingType !== 'In-Person' && (
                  <>
                    <InputField
                      classes='w-32'
                      label='Meeting ID'
                      placeholder='Meeting ID'
                      value={article.meeting_id}
                      onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
                    />
                    <InputField
                      classes='w-32 mr-2'
                      label='Passcode'
                      placeholder='Passcode'
                      value={article.passcode}
                      onChange={e => setArticle({ ...article, passcode: e.target.value })}
                    />
                  </>
                )}
              </div>

              {/* EVENT LINK */}
              <InputField
                label='Location'
                placeholder={
                  article.meetingType !== 'In-Person' ? 'Event Link (Virtual Meeting)' : 'Location (In-Person Meeting)'
                }
                value={article.meetingType !== 'In-Person' ? article.event_link : article.location}
                onChange={e =>
                  setArticle({
                    ...article,
                    [article.meetingType !== 'In-Person' ? 'event_link' : 'location']: e.target.value
                  })
                }
              />

              <TextAreaField
                placeholder='Additional Details (e.g. required readings, preparation material)'
                value={article.additional_details}
                onChange={e => setArticle({ ...article, additional_details: e.target.value })}
              />

              <div className='flex justify-between items-center mt-4'>
                <div></div>
                <div className='justify-center'>
                  <SubmitButton label='Submit' />
                </div>
                {selectedArticle ? (
                  <IconButton
                    sx={{
                      borderRadius: '20px',
                      p: 1,
                      backgroundColor: 'transparent',
                      color: '#808080',
                      '&:hover': { color: 'red' }
                    }}
                    onClick={() => onDelete(article._id)}>
                    <Delete sx={{ fontSize: '24px' }} />
                  </IconButton>
                ) : (
                  <div></div>
                )}
              </div>
            </form>
          </div>
          {/* Add New Purpose Dialog */}
          <NewPurposeDialog
            showAddPurposeModal={showAddPurposeModal}
            setShowAddPurposeModal={setShowAddPurposeModal}
            setNewPurpose={setNewPurpose}
            newPurpose={newPurpose}
            handleAddPurpose={handleAddPurpose}
          />
        </div>
      </Paper>
    </Modal>
  );
};

export default NewArticleForm;
