import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createFeedback, fetchUserFeedbacks } from '@/services/feedbacks';
import { toggleAttending } from '@/services/users';
import userStore from '@/stores/userStore';
import { formatDate } from '@/utils/dates';
import { AddCircle, Edit } from '@mui/icons-material';
import { Layout, Card, Table, Checkbox, Pagination, Modal, Input, Button } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { sortArticlesDescending } from '@/services/articles';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const { Content } = Layout;
const { TextArea } = Input;

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const OlderArticles = observer(() => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [attended, setAttended] = useState(user.attended || []);

  const {
    data: feedbacks,
    isLoading: isFeedbacksQueryLoading,
    refetch: refetchFeedbacks
  } = useQuery(['feedbacks', user?._id], () => fetchUserFeedbacks(user?._id), {
    enabled: !!user
  });

  const { allowedArticles, isLoading: isPurposesLoading } = useArticlePermissions();

  const sortedArticles = sortArticlesDescending(allowedArticles);

  useEffect(() => {
    if (!user || isFeedbacksQueryLoading) return;
    userStore.setFeedbacks(feedbacks);
  }, [user, feedbacks]);

  useEffect(() => {
    setAttended(user.attended);
  }, []);

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
    console.log(isAttending);
    if (user) {
      try {
        const response = await toggleAttending(user._id, articleId, isAttending);
        setAttended(response.attended);
        const updatedUser = { ...user, attended: response.attended };
        localStorage.setItem('CloudRoundsUser', JSON.stringify(updatedUser));
        console.log(response);
      } catch (error) {
        console.error('There was an error updating attendance:', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (current, size) => {
    setRowsPerPage(size);

    setPage(0);
  };

  const handleOpen = (article, feedback) => {
    setCurrentArticle(article);
    setCurrentFeedback(feedback || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isPurposesLoading) return <LoadingSpinner />;

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

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center' }}>
          <Card title='Events' bordered={false} style={{ width: '100%' }}>
            <Table
              dataSource={sortedArticles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
              pagination={false}
              rowKey={record => record._id}
              scroll={{ x: 'max-content' }}>
              <Table.Column title='Purpose' dataIndex='purpose' key='purpose' />
              <Table.Column title='Article Title' dataIndex='title' key='title' />
              <Table.Column title='Date' dataIndex='date' key='date' render={date => formatDate(date)} />
              <Table.Column
                title='Attended'
                key='attended'
                dataIndex='attended'
                render={(text, article) => (
                  <Checkbox
                    checked={attended && attended.includes(article._id)}
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
              total={sortedArticles.length}
              pageSize={rowsPerPage}
              current={page + 1}
              onChange={(page, pageSize) => handleChangePage(page - 1, pageSize)}
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
              placeholder='Your Feedback'
              value={currentFeedback}
              onChange={e => setCurrentFeedback(e.target.value)}
              rows={4}
            />
          </Modal>
        </div>
      </Content>
    </Layout>
  );
});

export default OlderArticles;
