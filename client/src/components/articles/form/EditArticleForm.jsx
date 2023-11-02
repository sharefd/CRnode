import { Close, Delete, Save } from '@mui/icons-material';
import { IconButton, Modal, Paper } from '@mui/material';
import { useState } from 'react';
import MyDatePicker from './MyDatePicker';
import { InputField, SelectField, TextAreaField, SubmitButton, meetingTypeField } from './ArticleFormComponents';

const EditArticleForm = ({ open, onClose, article, onSave, onDelete, allowedPurposes }) => {
  const [editedArticle, setEditedArticle] = useState(article);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('12:00 PM');
  const [endTime, setEndTime] = useState('12:00 PM');

  const handleSave = async e => {
    e.preventDefault();
    let eventLink = editedArticle.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const payload = {
      ...editedArticle,
      date: date,
      duration: `${startTime} - ${endTime}`,
      event_link: eventLink
    };

    onSave(payload);
  };

  if (!editedArticle) {
    return null;
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
      aria-labelledby='editedArticle-modal-title'
      aria-describedby='editedArticle-modal-description'>
      <Paper elevation={3} className='relative overflow-y-auto max-w-lg mx-auto mt-20 max-h-[80vh]'>
        <div className='relative overflow-y-auto max-w-lg mx-auto'>
          <div style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>
            <div className='text-center text-white bg-blue-600 p-2.5 rounded-t relative'>
              Create Event
              <IconButton onClick={onClose} style={{ position: 'absolute', right: 1, top: 2 }}>
                <Close sx={{ color: '#fff', fontSize: '22px' }} />
              </IconButton>
            </div>
            <form onSubmit={handleSave} className='p-6'>
              {/* TITLE */}
              <InputField
                label='Title'
                placeholder='Title'
                value={editedArticle.title}
                onChange={e => setEditedArticle({ ...editedArticle, title: e.target.value })}
              />

              <div className='flex justify-between mb-3 pt-1'>
                {/* Purpose */}
                <SelectField
                  field={purposeField}
                  value={editedArticle.purpose}
                  onChange={e => setEditedArticle({ ...editedArticle, purpose: e.target.value })}
                  error={null}
                  border={false}
                />

                {/* Speaker */}
                <InputField
                  label='Speaker'
                  placeholder='Speaker'
                  value={editedArticle.speaker}
                  onChange={e => setEditedArticle({ ...editedArticle, speaker: e.target.value })}
                />
              </div>

              {/* DATE AND TIME */}
              <div className='mb-5 flex justify-between'>
                <MyDatePicker setDate={setDate} setStartTime={setStartTime} setEndTime={setEndTime} />
              </div>

              <div className='flex justify-between mb-3 pt-1'>
                {/* VIRTUAL/IN-PERSON/Hybrid */}
                <SelectField
                  field={meetingTypeField}
                  value={editedArticle.meetingType}
                  onChange={e => setEditedArticle({ ...editedArticle, meetingType: e.target.value })}
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
                      value={editedArticle.meeting_id}
                      onChange={e => setEditedArticle({ ...editedArticle, meeting_id: e.target.value })}
                    />
                    <InputField
                      classes='w-32 mr-2'
                      label='Passcode'
                      placeholder='Passcode'
                      value={editedArticle.passcode}
                      onChange={e => setEditedArticle({ ...editedArticle, passcode: e.target.value })}
                    />
                  </>
                )}
              </div>

              {/* EVENT LINK */}
              <InputField
                label='Location'
                placeholder={
                  editedArticle.meetingType !== 'In-Person'
                    ? 'Event Link (Virtual Meeting)'
                    : 'Location (In-Person Meeting)'
                }
                value={article.meetingType !== 'In-Person' ? editedArticle.event_link : editedArticle.location}
                onChange={e =>
                  setEditedArticle({
                    ...editedArticle,
                    [editedArticle.meetingType !== 'In-Person' ? 'event_link' : 'location']: e.target.value
                  })
                }
              />

              <TextAreaField
                placeholder='Additional Details (e.g. required readings, preparation material)'
                value={editedArticle.additional_details}
                onChange={e => setEditedArticle({ ...editedArticle, additional_details: e.target.value })}
              />

              <div className='flex justify-center'>
                <SubmitButton label='Submit' />
              </div>
              <button
                type='button'
                className='text-white p-2 rounded-full bg-gray-400 hover:bg-red-600'
                onClick={() => onDelete(editedArticle._id)}>
                <Delete />
              </button>
            </form>
          </div>
        </div>
      </Paper>
    </Modal>
  );
};

export default EditArticleForm;
