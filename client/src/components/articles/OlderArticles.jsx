import { createFeedback, fetchUserFeedbacks } from '@/services/feedbacks';
import { toggleAttending } from '@/services/users';
import { formatDate } from '@/utils/dates';
import { AddCircle, Edit } from '@mui/icons-material';
import { Layout, Card, Table, Checkbox, Pagination, Modal, Input, Button, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { sortArticlesDescending } from '@/services/articles';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const { TextArea } = Input;

const OlderArticles = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [attended, setAttended] = useState(user.attended);

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
    if (isFeedbacksQueryLoading) return;
    setUserFeedbacks(feedbacks);
  }, [isFeedbacksQueryLoading]);

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
    const feedbackObj = userFeedbacks.find(f => f.articleId && f.articleId._id === articleId);
    return feedbackObj ? feedbackObj.feedback : '';
  };

  const handleToggleAttending = async (articleId, isAttending) => {
    try {
      const response = await toggleAttending(user._id, articleId, isAttending);
      const attendedArticles = allowedArticles.filter(a => response.attended.includes(a._id));
      console.log(attendedArticles);
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

  const handleOpen = (article, feedback) => {
    setCurrentArticle(article);
    setCurrentFeedback(feedback || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading || isFeedbacksQueryLoading) return <Spin />;

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
      <button
        onClick={() => handleOpen(article, '')}
        className='flex items-center w-[42px] justify-center basic-btn gray-outline hover:bg-[#5161ce] hover:text-white'>
        <AddCircle />
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
                checked={attended.map(a => a._id).includes(article._id)}
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
