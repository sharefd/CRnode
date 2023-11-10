import { createFeedback, fetchUserFeedbacks } from '@/services/feedbacks';
import { toggleAttending } from '@/services/users';
import userStore from '@/stores/userStore';
import { formatDate } from '@/utils/dates';
import { AddCircle, Edit } from '@mui/icons-material';
import { Layout, Card, Table, Checkbox, Pagination, Modal, Input, Button, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { sortArticlesDescending } from '@/services/articles';
import useArticlePermissions from '@/hooks/useArticlePermissions';
import { fetchCurrentUser } from '@/services/users';

const { TextArea } = Input;

const OlderArticles = observer(() => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [user, setUser] = useState(null);

  const { data: fetchedUser, isLoading: isUserLoading, refetch: refetchUser } = useQuery('userData', fetchCurrentUser);

  const {
    data: feedbacks,
    isLoading: isFeedbacksQueryLoading,
    refetch: refetchFeedbacks
  } = useQuery(['feedbacks', fetchedUser._id], () => fetchUserFeedbacks(fetchedUser._id), {
    enabled: !user
  });

  const { allowedArticles, isLoading } = useArticlePermissions();

  const sortedArticles = sortArticlesDescending(allowedArticles);

  const currentDate = new Date();
  const filteredArticles = sortedArticles.filter(article => new Date(article.date) <= currentDate);

  useEffect(() => {
    if (!isUserLoading || isFeedbacksQueryLoading) return;
    userStore.setFeedbacks(feedbacks);
  }, [isUserLoading, feedbacks]);

  useEffect(() => {
    if (!isUserLoading) {
      setUser(fetchedUser);
    }
  }, [isUserLoading]);

  const handleFeedbackSubmit = async currentArticle => {
    try {
      const newFeedback = await createFeedback(user._id, currentFeedback, currentArticle._id);
      feedbackMutation.mutate(newFeedback);
      handleClose();
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
    }
  };

  const feedbackMutation = useMutation(handleFeedbackSubmit, {
    onSuccess: () => {
      refetchFeedbacks();
    }
  });

  const getFeedback = articleId => {
    const feedbackObj = userStore.feedbacks.find(f => f.articleId && f.articleId._id === articleId);
    return feedbackObj ? feedbackObj.feedback : '';
  };

  const handleToggleAttending = async (articleId, isAttending) => {
    try {
      const response = await toggleAttending(user._id, articleId, isAttending);
      const attendedArticles = allowedArticles.filter(a => response.attended.includes(a._id));
      setUser({ ...user, attended: attendedArticles });
      await refetchUser();
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

  const handleOpen = (article, feedback) => {
    setCurrentArticle(article);
    setCurrentFeedback(feedback || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading || isUserLoading) return <Spin />;

  const renderFeedback = article => {
    const feedback = getFeedback(article._id);
    return feedback ? (
      <div style={{ fontSize: '12px' }}>
        <span>{feedback}</span>
        <Button onClick={() => handleOpen(article, feedback)}>
          <Edit />
        </Button>
      </div>
    ) : (
      <Button onClick={() => handleOpen(article, '')}>
        <AddCircle />
      </Button>
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
          scroll={{ x: 'max-content' }}>
          <Table.Column
            title='Purpose'
            dataIndex='purpose'
            key='purpose'
            render={purpose => (purpose ? purpose.name : '')}
          />
          <Table.Column
            title='Article Title'
            dataIndex='title'
            key='title'
            render={title => <div style={titleStyle}>{title}</div>}
          />
          <Table.Column title='Date' dataIndex='date' key='date' render={date => formatDate(date)} />
          <Table.Column
            title='Attended'
            key='attended'
            dataIndex='attended'
            render={(text, article) => (
              <Checkbox
                checked={user.attended.map(a => a._id).includes(article._id)}
                onChange={e => handleToggleAttending(article._id, e.target.checked)}
              />
            )}
          />
          <Table.Column
            title='Feedback'
            dataIndex='feedback'
            key='feedback'
            render={(text, article) => renderFeedback(article)}
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
        title='Feedback'
        open={open}
        onCancel={handleClose}
        footer={[
          <Button key='submit' type='' onClick={() => handleFeedbackSubmit(currentArticle)}>
            Submit
          </Button>
        ]}>
        <h5 style={{ fontStyle: 'italic' }}>{currentArticle ? currentArticle.title : ''}</h5>
        <TextArea
          id='feedback-edit'
          placeholder='This feature is being worked on!'
          value={currentFeedback}
          onChange={e => setCurrentFeedback(e.target.value)}
          rows={4}
        />
      </Modal>
    </Layout>
  );
});

export default OlderArticles;
