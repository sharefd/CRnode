import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useArticlePermissions from '@/hooks/useArticlePermissions';
import { deleteArticle, sortArticles } from '@/services/articles';
import { toggleFavorite, getFavorites } from '@/services/users';
import {
  getEmptyPurposes,
  getPurposesAfterCreate,
  getPurposesAfterDelete,
  getPurposesAfterUpdate,
  filterArticlesForList,
  getArticlesForPage
} from '@/utils/articleHelpers';
import { Col, Modal, Pagination, Row } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ActionBar from './actions/ActionBar';
import ArticleCalendar from './calendar/ArticleCalendar';
import NewArticleForm from './form/NewArticleForm';
import ArticleCard from './ArticleCard';
import { Badge } from 'antd';

const ArticleList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [organizerFilter, setOrganizerFilter] = useState([]);

  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [localArticles, setLocalArticles] = useState([]);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [favorites, setFavorites] = useState(null);

  const { userPurposes, allowedArticles, canReadPurposes, isLoading } = useArticlePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;

  const { data: favoritesData, isLoading: isFavoritesLoading } = useQuery(['favorites', user._id], () =>
    getFavorites(user._id)
  );

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

  useEffect(() => {
    if (isFavoritesLoading) return;
    setFavorites(favoritesData);
  }, [isFavoritesLoading]);

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

  const toggleNewArticleModal = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else {
      setOpenNewArticleModal(!openNewArticleModal);
    }
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

  const handleEdit = articleId => {
    setSelectedArticle(localArticles.find(article => article._id === articleId));
  };

  const handleFavorite = async articleId => {
    try {
      const isCurrentlyFavorite = favorites.includes(articleId);
      const isFavorite = !isCurrentlyFavorite;

      const data = await toggleFavorite(user._id, articleId, isFavorite);

      setFavorites(data);
    } catch (error) {
      console.error('There was an error updating favorite:', error);
    }
  };

  if (isLoading || isUpdateLoading || isFavoritesLoading) {
    return (
      <div className='text-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  const filteredArticles = filterArticlesForList(localArticles, organizerFilter, selectedPurposes);
  const currentArticles = getArticlesForPage(currentPage, articlesPerPage, filteredArticles);
  const purposesWithoutArticles = getEmptyPurposes(localArticles, userPurposes);

  return (
    <div style={{ background: '#e0e7ff' }}>
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
      <div style={{ padding: '0 16px' }} className='content-container'>
        <Row gutter={16} className='custom-flex'>
          <Col xs={24} lg={12} className='calendar-col'>
            <div className='max-w-full overflow-x-auto'>
              <ArticleCalendar articles={filteredArticles} />
            </div>
          </Col>

          <Col
            xs={24}
            lg={12}
            className='article-list-col order-list mt-5'
            style={{ background: '#e0e7ff', borderRadius: '10px' }}>
            <Badge
              status='warning'
              text={filteredArticles.length > 0 ? 'Upcoming Events' : 'You have no upcoming events.'}
              style={{
                marginBottom: '10px',
                border: '0px solid #0a0a0a',
                borderRadius: '10px',
                padding: '10px',
                color: 'white',
                background: '#5161CE',
                fontWeight: '900em',
                width: '100%', // Set the width to 100% to make it span the entire column
                display: 'block' // Ensure it behaves as a block element
              }}
            />

            {currentArticles.map((article, index) => (
              <ArticleCard
                key={index}
                article={article}
                isOrganizer={article.organizer.username === user.username}
                onFavorite={() => handleFavorite(article._id)}
                onEdit={() => handleEdit(article._id)}
                isFavorite={favorites && favorites.includes(article._id)}
              />
            ))}
                    {filteredArticles.length > 4 && (

            <Pagination
              current={currentPage}
              total={filteredArticles.length}
              pageSize={articlesPerPage}
              onChange={handlePageChange}
            />
                    )}
              
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
