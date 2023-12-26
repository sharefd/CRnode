import { useState, useEffect } from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Avatar, Typography } from 'antd';
import { formatDate } from '@/utils/dates';
import { FaRegEdit } from 'react-icons/fa';
import ExportToIcalButton from './calendar/ExportToIcalButton';
import purposeIcons from '../ui/PurposeIcons';
import openai from 'openai';
import axios from 'axios'; // Import the axios library


const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY 

const { Panel } = Collapse;
const { Text, Title } = Typography;

const ArticleCard = ({ article, isOrganizer, onFavorite, onEdit, isFavorite }) => {
  const formattedDate = formatDate(article.date);
  const formattedTime = article.duration;
  const isVirtual = article.meetingType === 'Virtual';
  const isHybrid = article.meetingType === 'Hybrid';

  const [suggestedReadings, setSuggestedReadings] = useState([]);

  useEffect(() => {
    const fetchSuggestedReadings = async () => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `Suggest relevant readings for "${article.title}"`,
            max_tokens: 100
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`
            }
          }
        );

        const readings = response.data.choices.map(choice => choice.text.trim());
        setSuggestedReadings(readings);
      } catch (error) {
        console.error('Error fetching suggested readings:', error);
      }
    };

    fetchSuggestedReadings();
  }, [article.title]);

  const isMeetingInfoPresent = () => {
    if (article.meetingType === 'Hybrid' || article.meetingType === 'Virtual') {
      return article.event_link || article.meeting_id;
    }
    return false;
  };

  const isWithin15MinutesOfEvent = () => {
    const [startTime, endTime] = article.duration.split(' - ');

    const eventStartDate = new Date(`${formattedDate} ${startTime}`);
    const eventEndDate = new Date(`${formattedDate} ${endTime}`);
    const currentTime = new Date();

    const startTimeMinus15Minutes = new Date(eventStartDate - 15 * 60 * 1000);
    const endTimeExact = new Date(eventEndDate);

    return currentTime >= startTimeMinus15Minutes && currentTime <= endTimeExact;
  };

  const today = new Date();
  const isToday = formattedDate === formatDate(today);

  const isEventLive = isToday && isWithin15MinutesOfEvent();

  const cardContainerStyle = {
    border: isEventLive ? '2px solid #f87171' : '0px solid #1e3a8a',
    borderRadius: '10px',
    animation: isEventLive ? 'flashBorder 1.5s infinite alternate' : 'none'
  };

  const isMeetingJoinable = isMeetingInfoPresent();

  const panels = [
    {
      key: '1',
      label: (
        <div className='relative rounded-md'>
          <div className='flex items-center rounded-md'>
            <Avatar style={{ backgroundColor: '#ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0px solid #5161ce' }}>
              {purposeIcons[article.purpose.name] || purposeIcons.DEFAULT}
            </Avatar>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <Title level={5} style={{ margin: 0, padding: 0, maxWidth: '90%' }}>
                {article.title}
              </Title>
              <Text type='secondary'>
                {formattedDate} | {formattedTime}
              </Text>
            </div>
          </div>
          <div className='absolute top-[-2px] right-[5px]'>
            {isFavorite ? (
              <StarFilled
                className={`text-yellow-600 cursor-pointer text-sm p-1`}
                onClick={event => {
                  event.stopPropagation();
                  onFavorite(article._id);
                }}
              />
            ) : (
              <StarOutlined
                className={`hover:text-yellow-600 cursor-pointer text-sm p-1`}
                onClick={event => {
                  event.stopPropagation();
                  onFavorite(article._id);
                }}
              />
            )}
          </div>
          <div className='absolute bottom-[-2px] right-[5px]'>
            {isOrganizer && (
              <FaRegEdit
                className='cursor-pointer text-xl hover:text-blue-600 p-1'
                onClick={event => {
                  event.stopPropagation();
                  onEdit(article._id);
                }}
              />
            )}
          </div>
        </div>
      ),
      children: (
        <Row gutter={[16, 16]} className='relative'>
          {isVirtual && (
            <Col span={24}>
              {isMeetingJoinable ? (
                <a
                  href={/^https?:\/\//i.test(article.event_link) ? article.event_link : `http://${article.event_link}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='basic-btn purple-full-link'>
                  Join Meeting
                </a>
              ) : (
                <p className='italic'>Link not yet provided.</p>
              )}
            </Col>
          )}
          <div className='absolute top-[-2px] right-0 mr-2'>
            <ExportToIcalButton article={article} text='Export to iCal' fontSize='12px' />
          </div>
          {!isVirtual && (
            <Col span={24}>
              {isHybrid && (
                <div className='mb-4'>
                  {isMeetingJoinable ? (
                    <a
                      href={article.event_link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='basic-btn purple-full-link'>
                      Join Meeting
                    </a>
                  ) : (
                    <p className='italic'>Link not yet provided.</p>
                  )}
                </div>
              )}
              <p style={{ fontFamily: '', fontWeight: '' }}>
                {article.location || <p className='italic'>Location not yet provided.</p>}
              </p>
              <div className='absolute top-[-2px] right-0 mr-2'>
                <ExportToIcalButton article={article} text='Export to iCal' fontSize='12px' />
              </div>
            </Col>
          )}
          {article.speaker && (
            <Col span={24}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: '700' }}>
                Speaker: <span>{article.speaker}</span>
              </p>
            </Col>
          )}
          <Col span={24}>
            <p style={{ fontFamily: 'sans-serif', fontWeight: '700' }}>
              Calendar: <span>{article.purpose.name}</span>
            </p>
          </Col>
          {article.additional_details && (
            <Col span={24}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: '700' }}>
                Notes: <span>{article.additional_details || 'None.'}</span>
              </p>
            </Col>
          )}
          {!isOrganizer && (
            <Col span={24}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: '700' }}>
                Organized by: <span>{`${article.organizer.firstName} ${article.organizer.lastName}`}</span>
              </p>
            </Col>
          )}
        </Row>
      ),
      showArrow: false
    },
    {
      key: '2',
      label: <Title level={5}>Suggested Readings</Title>,
      children: (
        <Col span={24}>
          <ul>
            {suggestedReadings.map((reading, index) => (
              <li key={index}>{reading}</li>
            ))}
          </ul>
        </Col>
      ),
      showArrow: false
    }
  ];

  return (
    <div className='article-card-container mb-4 rounded-md bg-[#f5f3ff]' style={cardContainerStyle}>
      <Collapse bordered={true} accordion={true} items={panels} defaultActiveKey={['0']} />
    </div>
  );
};

export default ArticleCard;
