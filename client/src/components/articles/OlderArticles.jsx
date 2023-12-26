import useArticlePermissions from '@/hooks/useArticlePermissions';
import { sortArticlesDescending } from '@/services/articles';
import { createFeedback, fetchUserFeedbacks, updateFeedback, deleteFeedback } from '@/services/feedbacks';
import { toggleAttending } from '@/services/users';
import { formatDate } from '@/utils/dates';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Input, Layout, Modal, Pagination, Spin, Table, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import PurposeAvatar from '../ui/PurposeAvatar';
import purposeIcons from '../ui/PurposeIcons';


const { TextArea } = Input;

const OlderArticles = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [attended, setAttended] = useState(user.attended);
  const [isEditOperation, setIsEditOperation] = useState(false);

  const {
    data: feedbacks,
    isLoading: isFeedbacksQueryLoading,
    refetch: refetchFeedbacks
  } = useQuery(['feedbacks', user?._id], () => fetchUserFeedbacks(user?._id), {
    enabled: !!user
  });

  const { allowedArticles, isLoading } = useArticlePermissions();

  const sortedArticles = sortArticlesDescending(allowedArticles);

  const currentDate = new Date();
  const filteredArticles = sortedArticles.filter(article => new Date(article.date) <= currentDate);

  useEffect(() => {
    if (feedbacks) {
      setUserFeedbacks(feedbacks);
    }
  }, [feedbacks, isFeedbacksQueryLoading]);

  const handleFeedbackSubmit = async currentArticle => {
    try {
      const updatedFeedback = await createFeedback(user._id, currentFeedback.feedback, currentArticle._id);
      const temp = userFeedbacks.filter(f => f._id !== updatedFeedback._id);
      setUserFeedbacks([...temp, updatedFeedback]);
      handleClose();
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
    }
  };

  const handleEditFeedbackAction = async () => {
    if (currentFeedback.feedback === '') {
      try {
        await deleteFeedback(currentFeedback._id);
        const temp = userFeedbacks.filter(f => f._id !== currentFeedback._id);
        setUserFeedbacks(temp);
        handleClose();
      } catch (error) {
        console.error('There was an error deleting the feedback:', error);
      }
    } else {
      try {
        const updatedFeedback = await updateFeedback(user._id, currentFeedback.feedback, currentArticle._id);
        const temp = userFeedbacks.filter(f => f._id !== updatedFeedback._id);
        setUserFeedbacks([...temp, updatedFeedback]);
        handleClose();
      } catch (error) {
        console.error('There was an error updating the feedback:', error);
      }
    }
  };

  const getFeedback = articleId => {
    const feedbackObj = userFeedbacks.find(f => f.articleId && f.articleId === articleId);
    return feedbackObj ? feedbackObj : null;
  };

  const handleToggleAttending = async (articleId, isAttending) => {
    try {
      const response = await toggleAttending(user._id, articleId, isAttending);
      const attendedArticles = allowedArticles.filter(a => response.attended.includes(a._id));
      setAttended(attendedArticles);
    } catch (error) {
      console.error('There was an error updating attendance:', error);
    }
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page - 1);
  };

  const handleChangeRowsPerPage = (current, size) => {
    setRowsPerPage(size);

    setPage(1);
  };

  const handleOpen = (article, feedback, isEdit) => {
    setCurrentArticle(article);
    setCurrentFeedback(feedback);
    setIsEditOperation(isEdit);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading || isFeedbacksQueryLoading) return <Spin />;

  const renderFeedback = article => {
    const feedbackObj = getFeedback(article._id);
    return feedbackObj ? (
      <div style={{ fontSize: '12px' }}>
        <span>{feedbackObj.feedback}</span>
        <button
          onClick={() => handleOpen(article, feedbackObj, true)}
          className='ml-[6px] hover:text-[#5161ce] border rounded-md px-1'>
          <EditOutlined style={{ fontSize: '12px' }} />
        </button>
      </div>
    ) : (
      <button
        onClick={() => handleOpen(article, '', false)}
        className='flex items-center justify-center  hover:text-[#5161ce] border rounded-md px-[5px] py-1'>
        <PlusCircleOutlined style={{ fontSize: '16px' }} />
      </button>
    );
  };

  const titleStyle = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  };

  return (
    <Layout>
      <Card bordered={false} className='w-full text-center'>
        <Typography.Title level={2} className='mt-4'>
          Previous Events
        </Typography.Title>
        <Table
          className='mt-8'
          dataSource={filteredArticles.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
          pagination={false}
          rowKey={record => record._id}
          scroll={{ x: 'max-content' }}
          style={{ overflowX: 'auto' }}> 
    
         <Table.Column
            title='Purpose'
            dataIndex='purpose'
            key='purpose'
            render={purpose => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {purposeIcons[purpose?.name] || purposeIcons.DEFAULT}
                {purpose && purpose.name && <span style={{ marginLeft: '8px' }}>{purpose.name}</span>}
              </div>
            )}
            width='20%' // Initial width for larger screens
          />
          <Table.Column
            title='Article Title'
            dataIndex='title'
            key='title'
            render={title => <div style={titleStyle}>{title}</div>}
            width='30%' // Initial width for larger screens
          />
          <Table.Column
            title='Date'
            dataIndex='date'
            key='date'
            render={date => formatDate(date)}
            width='15%' // Initial width for larger screens
          />
          <Table.Column
            title='Attended'
            dataIndex='attended'
            key='attended'
            render={(text, article) => (
              <Checkbox
                checked={attended.map(a => a._id).includes(article._id)}
                onChange={e => handleToggleAttending(article._id, e.target.checked)}
              />
            )}
            width='15%' // Initial width for larger screens
          />
          <Table.Column
            title='Feedback'
            dataIndex='feedback'
            key='feedback'
            render={(text, article) => renderFeedback(article)}
            width='20%' // Initial width for larger screens
          />
        </Table>
        <Pagination
          total={filteredArticles.length}
          pageSize={rowsPerPage}
          current={page + 1}
          onChange={(page, pageSize) => handleChangePage(page, pageSize)}
          onShowSizeChange={(current, size) => handleChangeRowsPerPage(current, size)}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['5', '10', '25']}
          style={{ marginTop: '20px', textAlign: 'right' }}
        />
      </Card>
      <Modal
        title={isEditOperation ? 'Edit Feedback' : 'New Feedback'}
        open={open}
        onCancel={handleClose}
        footer={[
          <Button
            key='submit'
            type=''
            onClick={() =>
              isEditOperation ? handleEditFeedbackAction(currentArticle) : handleFeedbackSubmit(currentArticle)
            }>
            Submit
          </Button>
        ]}>
        <h5 style={{ fontStyle: 'italic' }}>{currentArticle ? currentArticle.title : ''}</h5>
        <TextArea
          id='feedback-edit'
          placeholder='This feature is being worked on!'
          value={currentFeedback && currentFeedback.feedback}
          onChange={e => setCurrentFeedback(prev => ({ ...prev, feedback: e.target.value }))}
          rows={4}
        />
      </Modal>
    </Layout>
  );
});

export default OlderArticles;
