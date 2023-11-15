import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle, updateArticle } from '@/services/articles';
import { createPurpose, fetchPurposes } from '@/services/purposes';
import { initialArticleData } from '@/utils/constants';
import { extractTimesFromDuration } from '@/utils/dates';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import NewPurposeDialog from '../actions/NewPurposeDialog';
import './NewArticleForm.css';

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
  const [timeRange, setTimeRange] = useState([dayjs('8:00 AM', 'hh:mm A'), dayjs('9:00 AM', 'hh:mm A')]);
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
    } else {
      setArticlePurpose(null);

      setArticle(initialArticleData);
    }
  }, [selectedArticle]);

  const handleSave = async e => {
    console.log('Saving Edited article');
    let eventLink = article.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const [start, end] = timeRange;
    const startTimeFormatted = start.format('h:mm A');
    const endTimeFormatted = end.format('h:mm A');

    const payload = {
      ...article,
      date: date,
      duration: `${startTimeFormatted} - ${endTimeFormatted}`,
      organizer: user._id,
      purpose: articlePurpose._id,
      event_link: eventLink
    };

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
    console.log('Submitting new article');
    let eventLink = article.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const [start, end] = timeRange;
    const startTimeFormatted = start.format('h:mm A');
    const endTimeFormatted = end.format('h:mm A');

    const payload = {
      ...article,
      date: date,
      duration: `${startTimeFormatted} - ${endTimeFormatted}`,
      organizer: user._id,
      purpose: articlePurpose._id,
      event_link: eventLink // Update the event_link with the corrected URL
    };

    if (!payload.title) {
      console.error('Title is required');
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
    setArticle(initialArticleData);
    onClose();
  };

  return (
    <Modal open={open} onCancel={onModalClose} footer={null} className='new-article-form'>
      <Form onFinish={selectedArticle ? handleSave : handleSubmit} className='compact-form'>
        <Form.Item label='Title' labelCol={{ span: 24 }} colon={false}>
          <Input
            placeholder='Title'
            value={article.title}
            onChange={e => setArticle({ ...article, title: e.target.value })}
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Calendar' labelCol={{ span: 24 }} colon={false}>
              <Select
                value={(articlePurpose && articlePurpose._id) || ''}
                onChange={value => setArticlePurpose({ ...articlePurpose, _id: value })}>
                <Select.Option value='' disabled>
                  Select Purpose
                </Select.Option>
                {allowedPurposes.map(purpose => (
                  <Select.Option key={purpose._id} value={purpose._id}>
                    {purpose.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Speaker' labelCol={{ span: 24 }} colon={false}>
              <Input
                placeholder='Speaker'
                value={article.speaker}
                onChange={e => setArticle({ ...article, speaker: e.target.value })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Col span={24}>
          <Form.Item label='Date and Time' labelCol={{ span: 24 }} colon={false}>
            <Row gutter={16}>
              <Col span={12}>
                <DatePicker
                  value={dayjs(article.date)}
                  onChange={dateValue => {
                    if (!dateValue) {
                      setDate(dayjs(article.date));
                      return;
                    }
                    setDate(dateValue);
                    setArticle({ ...article, date: dayjs(dateValue) });
                  }}
                />
              </Col>
              <Col span={12}>
                <TimePicker.RangePicker
                  value={timeRange}
                  onChange={setTimeRange}
                  format='hh:mm A'
                  minuteStep={5}
                  use12Hours
                />
              </Col>
            </Row>
          </Form.Item>
        </Col>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Meeting Type' labelCol={{ span: 24 }} colon={false}>
              <Select value={article.meetingType} onChange={value => setArticle({ ...article, meetingType: value })}>
                <Select.Option value='Virtual'>Virtual</Select.Option>
                <Select.Option value='In-Person'>In-Person</Select.Option>
                <Select.Option value='Hybrid'>Hybrid</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {article.meetingType !== 'In-Person' && (
            <Col span={12}>
              <Form.Item label='Meeting Details' labelCol={{ span: 24 }} colon={false}>
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
        <Form.Item label='Location' labelCol={{ span: 24 }} colon={false}>
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

        <Form.Item>
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
