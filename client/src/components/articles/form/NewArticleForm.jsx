import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle, updateArticle } from '@/services/articles';
import { createPurpose, fetchPurposes } from '@/services/purposes';
import { initialArticleData } from '@/utils/constants';
import { extractTimesFromDuration } from '@/utils/dates';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import NewPurposeDialog from '../actions/NewPurposeDialog';
import './NewArticleForm.css';
import TimeRangePicker from './TimeRangePicker';
const { Option } = Select;

const NewArticleForm = ({
  open,
  onClose,
  selectedArticle,
  setSelectedArticle,
  onDelete,
  onArticleUpdate,
  onCreateArticle
}) => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [allowedPurposes, setAllowedPurposes] = useState(null);
  const [showAddPurposeModal, setShowAddPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [article, setArticle] = useState(initialArticleData);

  const [date, setDate] = useState(dayjs());
  const [timeRange, setTimeRange] = useState(() => {
    if (selectedArticle) {
      const [startTime, endTime] = extractTimesFromDuration(selectedArticle.duration);
      return [startTime, endTime];
    } else {
      return ['', ''];
    }
  });
  const [articlePurpose, setArticlePurpose] = useState((selectedArticle && selectedArticle.purpose) || null);

  const {
    data: purposes,
    isLoading,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', user._id], () => fetchPurposes(user._id));

  const filterPurposesForUser = () => {
    const canWritePurposes = purposes?.filter(purpose => {
      const canWriteMembers = purpose.canWriteMembers.map(u => u._id);
      return canWriteMembers.includes(user._id.toString());
    });

    return canWritePurposes;
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const canWrite = filterPurposesForUser();

    setAllowedPurposes(canWrite);
    if (canWrite.length > 0) {
      setArticle(prevArticle => ({ ...prevArticle, purpose: canWrite[0]._id.toString() }));
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedArticle) {
      setArticle(selectedArticle);
      setArticlePurpose(selectedArticle.purpose);
      const [startTime, endTime] = extractTimesFromDuration(selectedArticle.duration);
      setTimeRange([startTime, endTime]);
      setDate(dayjs(selectedArticle.date)); // Set to the article's date
    } else {
      setArticlePurpose(null);
      setArticle(initialArticleData);
      setTimeRange(['', '']);
      setDate(dayjs());
    }
  }, [selectedArticle]);

  const handleSave = async e => {
    const [start, end] = timeRange;
    const startTimeFormatted = start.format('h:mm A');
    const endTimeFormatted = end.format('h:mm A');

    if (!timeRange[0] || !timeRange[1]) {
      message.error('Both start and end times are required');
      return;
    }

    if (!articlePurpose || !articlePurpose._id) {
      message.error('Purpose is required');
      return;
    }

    const payload = {
      ...article,
      date: date ? date : article.date,
      duration: `${startTimeFormatted} - ${endTimeFormatted}`,
      organizer: user._id,
      purpose: articlePurpose._id,
      event_link: article.event_link
    };

    if (!payload.title || payload.title.trim() === '') {
      message.error('Title cannot be empty');
      return;
    }

    try {
      const updatedArticle = await updateArticle(payload);
      onArticleUpdate(updatedArticle);
      setSelectedArticle(null);
    } catch (error) {
      console.error(error);
      setSelectedArticle(null);
    }
  };

  const handleSubmit = async e => {
    const [start, end] = timeRange;

    if (!timeRange[0] || !timeRange[1]) {
      message.error('Both start and end times are required');
      return;
    }

    const startTimeFormatted = start.format('h:mm A');
    const endTimeFormatted = end.format('h:mm A');

    if (!articlePurpose || !articlePurpose._id) {
      message.error('Purpose is required');
      return;
    }

    const payload = {
      ...article,
      date: date ? date : article.date,
      duration: `${startTimeFormatted} - ${endTimeFormatted}`,
      organizer: user._id,
      purpose: articlePurpose._id,
      event_link: article.event_link
    };

    if (!payload.title || payload.title.trim() === '') {
      message.error('Title cannot be empty');
      return;
    }

    try {
      const newArticle = await createArticle(payload);
      onCreateArticle(newArticle);
      onClose();
    } catch (error) {
      console.error(error);
    }
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

  if (!user || !allowedPurposes) {
    return <LoadingSpinner />;
  }

  const onModalClose = () => {
    setSelectedArticle(null);
    setArticlePurpose(null);
    setTimeRange(['', '']);
    setDate(dayjs());
    setArticle(initialArticleData);
    onClose();
  };

  return (
    <Modal open={open} onCancel={onModalClose} footer={null} className='new-article-form'>
          
{allowedPurposes.length > 0 ? (

          
      <Form onFinish={selectedArticle ? handleSave : handleSubmit} className='compact-form'>
        <Form.Item
          label='Title*'
          labelCol={{ span: 24 }}
          colon={false}
          className='newArticleForm'
          rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input
            placeholder='Title'
            value={article.title}
            onChange={e => setArticle({ ...article, title: e.target.value })}
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='Calendar*'
              labelCol={{ span: 24 }}
              colon={false}
              className='newArticleForm'
              rules={[{ required: true, message: 'Please select a calendar!' }]}>
              <Select
                value={(articlePurpose && articlePurpose._id) || ''}
                onChange={value => setArticlePurpose({ ...articlePurpose, _id: value })}>
                <Option value='' disabled>
                  <span className='disabled-option'>Select Purpose</span>
                </Option>
                {allowedPurposes.map(purpose => (
                  <Option key={purpose._id} value={purpose._id}>
                    {purpose.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Speaker' labelCol={{ span: 24 }} colon={false} className='newArticleForm'>
              <Input
                placeholder='Speaker'
                value={article.speaker}
                onChange={e => setArticle({ ...article, speaker: e.target.value })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='Date*'
              labelCol={{ span: 24 }}
              colon={false}
              className='newArticleForm'
              rules={[{ required: true, message: 'Please select a date!' }]}>
              <DatePicker
                className='w-full'
                value={date ? dayjs(date) : null}
                onChange={dateValue => {
                  setDate(dateValue ? dayjs(dateValue) : null);
                  setArticle({ ...article, date: dayjs(dateValue) });
                }}
                disabledDate={current => current && current.isBefore(dayjs(), 'day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Time*'
              labelCol={{ span: 24 }}
              colon={false}
              className='newArticleForm'
              rules={[{ required: true, message: 'Please select a start/end time!' }]}>
              <TimeRangePicker
                value={timeRange}
                onChange={newRange => setTimeRange(newRange)}
                isNewArticleModalOpen={open}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Meeting Type' labelCol={{ span: 24 }} colon={false} className='newArticleForm'>
              <Select value={article.meetingType} onChange={value => setArticle({ ...article, meetingType: value })}>
                <Select.Option value='Virtual'>Virtual</Select.Option>
                <Select.Option value='In-Person'>In-Person</Select.Option>
                <Select.Option value='Hybrid'>Hybrid</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {article.meetingType !== 'In-Person' && (
            <Col span={12}>
              <Form.Item label='Meeting Details' labelCol={{ span: 24 }} colon={false} className='newArticleForm'>
                <Row gutter={16}>
                  <Col span={9}>
                    <Input
                      placeholder='ID'
                      value={article.meeting_id}
                      onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
                    />
                  </Col>
                  <Col span={15}>
                    <Input
                      placeholder='Passcode'
                      value={article.passcode}
                      onChange={e => setArticle({ ...article, passcode: e.target.value })}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          )}
        </Row>

        {/* EVENT LINK */}
        <Form.Item
          label={article.meetingType === 'In-Person' ? 'Location' : 'Event Link'}
          className='newArticleForm'
          labelCol={{ span: 24 }}
          colon={false}>
          <Input
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
        </Form.Item>

        <Form.Item label='Notes' labelCol={{ span: 24 }} colon={false} className='newArticleForm'>
          <Input.TextArea
            placeholder='Additional Details (e.g. required readings, preparation material)'
            value={article.additional_details}
            onChange={e => setArticle({ ...article, additional_details: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Row gutter={24}>
            <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}></Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type='primary' ghost className='submit-blue-button' htmlType='submit'>
                Submit
              </Button>
            </Col>
            {selectedArticle && (
              <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type='danger'
                  className='delete-button'
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(article._id)}
                />
              </Col>
            )}
          </Row>
        </Form.Item>
      </Form>
        ) : (
     <div className='disabled-option'>
  No calendars yet. Click the <a href="https://cloudrounds.com/manage" style={{ color: '#333', textDecoration: 'underline' }}>Manage tab</a> to create a calendar.
</div>



      )}
          

      <NewPurposeDialog
        showAddPurposeModal={showAddPurposeModal}
        setShowAddPurposeModal={setShowAddPurposeModal}
        setNewPurpose={setNewPurpose}
        newPurpose={newPurpose}
        handleAddPurpose={handleAddPurpose}
      />
    </Modal>
  );
};

export default NewArticleForm;
