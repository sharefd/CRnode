import { CaretDownOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Avatar, Typography } from 'antd';
import { useState } from 'react';
import { formatDate } from '@/utils/dates';
import { hashStringToColor, createAcronym } from '@/utils/cardHelpers';
import { FaRegEdit } from 'react-icons/fa';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const ArticleCard = ({ article, isOrganizer, onFavorite, onEdit, isFavorite }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const formattedDate = formatDate(article.date);
  const formattedTime = article.duration;
  const isVirtual = article.meetingType === 'Virtual';
  const isHybrid = article.meetingType === 'Hybrid';
  const [initials, setInitials] = useState(
    article.organizer.firstName[0].toUpperCase() + article.organizer.lastName[0].toUpperCase()
  );

  const isMeetingInfoPresent = () => {
    if (article.meetingType === 'Hybrid' || article.meetingType === 'Virtual') {
      return article.event_link || (article.meeting_id && article.passcode);
    }
    return false;
  };

  const isMeetingJoinable = isMeetingInfoPresent();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const header = (
    <div className='relative rounded-md'>
      <div className='flex items-center rounded-md'>
        <Avatar style={{ backgroundColor: hashStringToColor(article.purpose.description) }}>
          {createAcronym(article.purpose.description)}
        </Avatar>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <Title level={5} style={{ margin: 0, padding: 0 }}>
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
  );

  const panels = [
    {
      key: '1',
      label: (
        <div className='relative rounded-md'>
          <div className='flex items-center rounded-md'>
            <Avatar style={{ backgroundColor: hashStringToColor(article.purpose.description) }}>
              {createAcronym(article.purpose.description)}
            </Avatar>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <Title level={5} style={{ margin: 0, padding: 0 }}>
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
        <Row gutter={[16, 16]}>
          {isVirtual && (
            <Col span={24}>
              {article.meeting_id && article.passcode ? (
                <a
                  href={article.event_link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='basic-btn purple-full-link'>
                  Join Meeting
                </a>
              ) : (
                <p className='italic'>Meeting information will be disclosed in the near future.</p>
              )}
            </Col>
          )}

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
                    <p className='italic'>Meeting information will be disclosed in the near future.</p>
                  )}
                </div>
              )}
              <p style={{ fontFamily: 'sans-serif', fontWeight: '700' }}>
                Location: <span>{article.location || 'Not disclosed yet.'}</span>
              </p>
            </Col>
          )}

          {!isOrganizer && (
            <Col>
              <p>Organized by: {`${article.organizer.firstName} ${article.organizer.lastName}`}</p>
            </Col>
          )}
        </Row>
      ),
      showArrow: false
    }
  ];
  return (
    <div className='article-card-container mb-4 rounded-md bg-[#f0f0f0]'>
      <Collapse bordered={true} accordion={true} items={panels} defaultActiveKey={['0']} />
    </div>
  );
};

export default ArticleCard;
