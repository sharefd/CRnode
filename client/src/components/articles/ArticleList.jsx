import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { deleteArticle, sortArticles, updateArticle } from '@/services/articles';
import { Edit } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import ActionBar from './actions/ActionBar';
import ArticleCalendar from './calendar/ArticleCalendar';
import { purposeIcons } from '@/components/ui/PurposeIcons';
import { formatDate } from '@/utils/dates';
import useArticlePermissions from '@/hooks/useArticlePermissions';
import NewArticleForm from './form/NewArticleForm';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const ArticleList = observer(() => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [localArticles, setLocalArticles] = useState([]);

  const {
    allowedArticles,
    canReadPurposes,
    canWritePurposes,
    isLoading,
    refetchArticles,
    refetch: refetchPurposes
  } = useArticlePermissions();

  useEffect(() => {
    if (isLoading) return;

    const sortedArticles = sortArticles(allowedArticles);
    setLocalArticles(sortedArticles);
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
    }
  });

  const updateMutation = useMutation(updateArticle, {
    onSuccess: updatedArticle => {
      const index = localArticles.findIndex(article => article._id === updatedArticle._id);
      const updatedArticles = [...localArticles];
      updatedArticles[index] = { ...updatedArticle, organizer: { user: user._id, username: user.username } };
      setLocalArticles(updatedArticles);
    }
  });

  const handleDelete = async articleId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this article?');
    if (!isConfirmed) return;

    deleteMutation.mutate(articleId);
    setSelectedArticle(null);
  };

  const handleSave = async editedArticle => {
    const updatedArticle = { ...editedArticle, organizer: user._id };
    setSelectedArticle(null);
    updateMutation.mutate(updatedArticle);
  };

  const toggleDetails = articleId => {
    setShowDetails(prevState => ({
      ...prevState,
      [articleId]: !prevState[articleId]
    }));

    setIsExpanded(prevState => ({
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredArticles = selectedPurposes.includes('Show All')
    ? localArticles.filter(isArticleAfterCurrentDate)
    : localArticles.filter(article => selectedPurposes.includes(article.purpose)).filter(isArticleAfterCurrentDate);

  return (
    <div>
      <ActionBar
        user={user}
        canReadPurposes={canReadPurposes}
        selectedPurposes={selectedPurposes}
        setSelectedPurposes={setSelectedPurposes}
        toggleNewArticleModal={toggleNewArticleModal}
      />
      <div className='px-4'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-7'>
            {filteredArticles.map((article, index) => (
              <div key={index} className='mb-5 border rounded relative'>
                <div className='p-4'>
                  <div className='grid grid-cols-12 gap-2'>
                    <div className='col-span-3'>
                      <p className='text-sm text-gray-500'>{formatDate(article.date)}</p>
                      <p className='text-xs text-gray-500'>{article.duration}</p>
                    </div>
                    <div className='col-span-9'>
                      <div className='bg-blue-50 p-2 rounded-lg'>
                        <h6 className='font-semibold'>{article.title}</h6>
                      </div>
                      <div className={`my-2 flex space-x-2 mb-10 ${showDetails[article._id] ? 'mb-4' : 'mb-10'}`}
                          
                          style={{ paddingTop: '7px' }}
                          >
                        <a
                          href={article.event_link}
                          target='_blank'
                    className='text-white bg-blue-500 px-2 py-1 rounded text-sm hover:bg-blue-600'> 
                            Join Meeting
                        </a>
                        <button
                          onClick={() => toggleDetails(article._id)}
                          className='text-gray-500 border border-gray-500 px-2 py-1 rounded text-sm hover:bg-gray-300'>
                          More Details
                        </button>
                      </div>
                      <div
                        className={`flex items-center mx-2 my-1 mb-8 text-sm ${
                          showDetails[article._id] ? 'block' : 'hidden'
                        }`}>
                        <span>Meeting ID: {article.meeting_id || 'None'}</span>
                        <div className='mx-2 h-5 border-r border-gray-400'></div>
                        <span>Passcode: {article.passcode || 'None'}</span>
                        <div className='mx-2 h-5 border-r border-gray-400'></div>
                        <span>Speaker: {article.speaker || ''}</span>
                      </div>
                      <div
                        className={`flex items-center mx-2 my-1 text-sm ${
                          showDetails[article._id] ? 'block' : 'hidden'
                        }`}>
                        <span>{article.additional_details || ''}</span>
                      </div>
                      <div className='mt-2'>
                        <div className='purpose-badge'>
                          {purposeIcons[article.purpose] || purposeIcons.DEFAULT}
                          <span style={{ fontSize: '13px' }}>{article.purpose}</span>
                        </div>
                        <button
                          className={`edit-article ${article.organizer._id === user._id ? 'creator' : ''}`}
                          onClick={() => setSelectedArticle(article)}
                          disabled={article.organizer._id !== user._id}>
                          Created by {article.organizer.username}
                          {article.organizer._id === user._id && <Edit sx={{ fontSize: '12px', ml: 0.5 }} />}
                        </button>
                        {/* END OF card footer*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='col-span-6 md:col-span-5 relative mt-[-5]'>
            <ArticleCalendar articles={localArticles} />
          </div>
        </div>
      </div>
      <NewArticleForm
        open={openNewArticleModal || !!selectedArticle}
        onClose={toggleNewArticleModal}
        localArticles={localArticles}
        setLocalArticles={setLocalArticles}
        refetchArticles={refetchArticles}
        selectedArticle={selectedArticle}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
});

export default ArticleList;
