import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { purposeIcons } from '@/components/ui/PurposeIcons';
import useArticlePermissions from '@/hooks/useArticlePermissions';
import { deleteArticle, sortArticles } from '@/services/articles';
import { formatDate } from '@/utils/dates';
import { Edit } from '@mui/icons-material';
import { Button, Card, Col, Divider, Modal, Pagination, Row } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import ActionBar from './actions/ActionBar';
import ArticleCalendar from './calendar/ArticleCalendar';
import NewArticleForm from './form/NewArticleForm';
import {
  getPurposesAfterUpdate,
  getPurposesAfterCreate,
  getEmptyPurposes,
  getPurposesAfterDelete
} from '@/utils/articleHelpers';

const ArticleList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [organizerFilter, setOrganizerFilter] = useState([]);

  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [localArticles, setLocalArticles] = useState([]);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const { userPurposes, allowedArticles, canReadPurposes, isLoading, refetchArticles, refetchPurposes } =
    useArticlePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (isLoading) return;

    const sortedArticles = sortArticles(allowedArticles);
    setLocalArticles(sortedArticles);

    const organizers = [...new Set(sortedArticles.map(article => article.organizer.username))];
    setSelectedOrganizers(organizers);
  }, [isLoading, allowedArticles]);

  useEffect(() => {
    if (canReadPurposes.length > 0 && selectedPurposes.length === 0) {
      setSelectedPurposes(canReadPurposes.map(p => p.name));
    }
  }, [canReadPurposes]);

  const deleteMutation = useMutation(deleteArticle, {
    onSuccess: (data, variables) => {
      const updatedArticles = localArticles.filter(article => article._id !== variables);
      setLocalArticles(updatedArticles);

      const newSelectedPurposes = getPurposesAfterDelete(updatedArticles, selectedArticle, selectedPurposes);
      setSelectedPurposes(newSelectedPurposes);
      setSelectedArticle(null);
    }
  });

  const handleDelete = async articleId => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteMutation.mutate(articleId);
      },
      onCancel() {
        return;
      }
    });
  };

  const toggleDetails = articleId => {
    setShowDetails(prevState => ({
      ...prevState,
      [articleId]: !prevState[articleId]
    }));
  };

  const toggleNewArticleModal = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else {
      setOpenNewArticleModal(!openNewArticleModal);
    }
  };

  const currentDate = new Date();
  const eightHoursAgo = new Date(currentDate);
  eightHoursAgo.setHours(eightHoursAgo.getHours() - 28);

  const isArticleAfterCurrentDate = article => {
    const articleDate = new Date(article ? article.date : '');
    return articleDate >= eightHoursAgo;
  };

  const handleArticleUpdate = async updatedArticle => {
    setIsUpdateLoading(true);

    const updatedArticles = localArticles.map(article =>
      article._id === updatedArticle._id ? updatedArticle : article
    );
    setLocalArticles(sortArticles(updatedArticles));

    const newSelectedPurposes = getPurposesAfterUpdate(
      localArticles,
      userPurposes,
      updatedArticle,
      updatedArticles,
      selectedPurposes
    );

    setSelectedPurposes(newSelectedPurposes);
    setIsUpdateLoading(false);
  };

  const handleCreateArticle = async newArticle => {
    setIsUpdateLoading(true);

    const allArticles = [...localArticles, newArticle];
    setLocalArticles(sortArticles(allArticles));

    const newSelectedPurposes = getPurposesAfterCreate(userPurposes, newArticle, selectedPurposes);

    setSelectedPurposes(newSelectedPurposes);
    setIsUpdateLoading(false);
  };

  if (isLoading || isUpdateLoading) {
    return <LoadingSpinner />;
  }

  const filteredArticles = localArticles
    .filter(article => {
      return organizerFilter.length === 0 || organizerFilter.includes(article.organizer.username);
    })
    .filter(article => {
      return selectedPurposes.includes('Show All') || selectedPurposes.includes(article.purpose.name);
    })
    .filter(isArticleAfterCurrentDate);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const purposesWithoutArticles = getEmptyPurposes(localArticles, userPurposes);

  const isMeetingJoinable = article => {
    if (article.meetingType === 'Hybrid' || article.meetingType === 'Virtual') {
      return article.event_link || (article.meeting_id && article.passcode);
    }
    return false;
  };

  return (
    <div>
      <ActionBar
        user={user}
        mostRecentArticle={currentArticles[0]}
        selectedPurposes={selectedPurposes}
        setSelectedPurposes={setSelectedPurposes}
        toggleNewArticleModal={toggleNewArticleModal}
        selectedOrganizers={selectedOrganizers}
        organizerFilter={organizerFilter}
        setOrganizerFilter={setOrganizerFilter}
        userPurposes={userPurposes}
        emptyPurposes={purposesWithoutArticles}
      />
      <div style={{ padding: '0 16px' }}>
        <Row gutter={16} className='custom-flex'>
          <Col xs={24} lg={12} className='calendar-col'>
            <div className='max-w-full overflow-x-auto'>
              <ArticleCalendar articles={currentArticles} />
            </div>
          </Col>

          <Col xs={24} lg={12} className='article-list-col order-list'>
            {currentArticles.map((article, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <Row gutter={8}>
                  <Col span={6}>
                    <p style={{ fontSize: 'small', color: '#8c8c8c' }}>{formatDate(article.date)}</p>
                    <p style={{ fontSize: 'x-small', color: '#8c8c8c' }}>{article.duration}</p>
                  </Col>
                  <Col span={18}>
                    <div className='bg-[#d6daf9] text-black px-2 py-1 rounded mb-3'>{article.title}</div>

                    <div style={{ marginTop: '8px', marginBottom: showDetails[article._id] ? '16px' : '40px' }}>
                      {isMeetingJoinable(article) ? (
                        <a
                          href={article.event_link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='basic-btn join-meeting-btn'>
                          {article.meetingType === 'In-Person' ? 'In-Person' : 'Join Meeting'}
                        </a>
                      ) : (
                        <button className='basic-btn bg-[#5161ce]'>Virtual</button>
                      )}

                      <button className='basic-btn gray-outline' onClick={() => toggleDetails(article._id)}>
                        More Details
                      </button>
                    </div>

                    {showDetails[article._id] && (
                      <>
                        {article.meetingType !== 'In-Person' ? (
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span>Meeting ID: {article.meeting_id || 'None'}</span>
                            <Divider type='vertical' />
                            <span>Passcode: {article.passcode || 'None'}</span>
                            <Divider type='vertical' />
                            <span>Speaker: {article.speaker || ''}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span>Location: {article.location || 'Not specified'}</span>
                            <Divider type='vertical' />
                            <span>Speaker: {article.speaker || ''}</span>
                          </div>
                        )}
                        <div style={{ marginBottom: '8px' }}>
                          <span>{article.additional_details || ''}</span>
                        </div>
                      </>
                    )}
                  </Col>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Button
                      onClick={() => setSelectedArticle(article)}
                      disabled={article.organizer.username !== user.username}
                      style={{ fontSize: '12px' }}>
                      by {`${article.organizer.firstName} ${article.organizer.lastName}`}
                      {article.organizer.username === user.username && (
                        <Edit style={{ fontSize: '12px', marginLeft: '4px' }} />
                      )}
                    </Button>
                    <div className='purpose-badge'>
                      {purposeIcons.DEFAULT}
                      <span style={{ fontSize: '13px' }}>{article.purpose.name}</span>
                    </div>
                  </div>
                </Row>
              </Card>
            ))}
            <Pagination
              current={currentPage}
              total={filteredArticles.length}
              pageSize={articlesPerPage}
              onChange={handlePageChange}
            />
          </Col>
        </Row>
      </div>
      <NewArticleForm
        open={openNewArticleModal || !!selectedArticle}
        onClose={toggleNewArticleModal}
        localArticles={localArticles}
        selectedArticle={selectedArticle}
        setSelectedArticle={setSelectedArticle}
        onDelete={handleDelete}
        onCreateArticle={handleCreateArticle}
        onArticleUpdate={handleArticleUpdate}
      />
    </div>
  );
});

export default ArticleList;
