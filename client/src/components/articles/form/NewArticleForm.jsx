import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Modal, Input, Select, Button, DatePicker, TimePicker, Form, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { createArticle, sortArticles } from '@/services/articles';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createPurpose, fetchPurposes } from '@/services/purposes';
import NewPurposeDialog from '../actions/NewPurposeDialog';
import { initialArticleData } from '@/utils/constants';
import './NewArticleForm.css';
import dayjs from 'dayjs';
import { extractTimesFromDuration } from '@/utils/dates';

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
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [allowedPurposes, setAllowedPurposes] = useState(null);
  const [showAddPurposeModal, setShowAddPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [article, setArticle] = useState(initialArticleData);

  const [date, setDate] = useState(dayjs());
  const [timeRange, setTimeRange] = useState([dayjs('12:00 PM', 'hh:mm A'), dayjs('12:00 PM', 'hh:mm A')]);

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
      setArticle(prevArticle => ({ ...prevArticle, purpose: canWrite[0]._id.toString() }));
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedArticle) {
      setArticle(selectedArticle);
      const [startTime, endTime] = extractTimesFromDuration(selectedArticle.duration);
      setTimeRange([startTime, endTime]);
      console.log(selectedArticle);
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
      purpose: article.purpose ? article.purpose : allowedPurposes[0]._id.toString(),
      event_link: eventLink
    };

    onSave(payload);
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
    console.log('Submitting new article');
    let eventLink = article.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const [start, end] = timeRange;
    const startTimeFormatted = start.format('h:mm A');
    const endTimeFormatted = end.format('h:mm A');

    console.log(`${startTimeFormatted} - ${endTimeFormatted}`);

    const payload = {
      ...article,
      date: date,
      duration: `${startTimeFormatted} - ${endTimeFormatted}`,
      organizer: user._id,
      purpose: article.purpose ? article.purpose : allowedPurposes[0]._id.toString(),
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

  return (
    <Modal open={open} onCancel={onClose} footer={null} className='new-article-form'>
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
            <Form.Item label='Purpose' labelCol={{ span: 24 }} colon={false}>
              <Select value={article.purpose} onChange={value => setArticle({ ...article, purpose: value })}>
                <Select.Option value='' disabled>
                  Select Purpose
                </Select.Option>
                {allowedPurposes.map(purpose => (
                  <Select.Option key={purpose._id.toString()} value={purpose._id.toString()}>
                    {purpose.description}
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
              <Col span={8}>
                <DatePicker onChange={setDate} />
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
          <Col span={8}>
            <Form.Item label='Meeting Type' labelCol={{ span: 24 }} colon={false}>
              <Select value={article.meetingType} onChange={value => setArticle({ ...article, meetingType: value })}>
                <Select.Option value='Virtual'>Virtual</Select.Option>
                <Select.Option value='In-Person'>In-Person</Select.Option>
                <Select.Option value='Hybrid'>Hybrid</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {article.meetingType !== 'In-Person' && (
            <Col span={16}>
              <Form.Item label='Meeting Details' labelCol={{ span: 24 }} colon={false}>
                <Row gutter={16}>
                  <Col span={9}>
                    <Input
                      placeholder='ID'
                      value={article.meeting_id}
                      onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
                    />
                  </Col>
                  <Col span={9}>
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
