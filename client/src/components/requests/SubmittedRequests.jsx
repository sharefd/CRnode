import { deleteRequest } from '@/services/requests';
import userStore from '@/stores/userStore';
import { DeleteOutlined, HourglassOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Table, Typography, Progress, Pagination } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import useRequestPermissions from '@/hooks/useRequestPermissions';

const { Content } = Layout;

const SubmittedRequests = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(false);

  const { allowedRequests, isLoading: isQueryLoading } = useRequestPermissions(user._id);

  const userRequests = allowedRequests.filter(request => request.user._id === user._id);

  const deleteMutation = useMutation(deleteRequest, {
    onSuccess: (data, variables) => {
      refetch();
      userStore.setSubmittedRequests(userStore.submittedRequests.filter(request => request._id !== variables));
    },
    onError: error => {
      console.error('Error deleting request:', error);
    }
  });

  const handleChangePage = (newPage, newRowsPerPage) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleDelete = requestId => {
    deleteMutation.mutate(requestId);
  };

  if (!user || isQueryLoading || isLoading) {
    return <Progress percent={100} status='active' />;
  }

  return (
    <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center' }}>
      <Typography.Title level={2}>My Submitted Requests</Typography.Title>
      {isLoading && <Progress percent={100} status='active' />}
      <Table
        dataSource={rowsPerPage > 0 ? userRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage) : userRequests}
        pagination={false}
        rowKey={record => record._id}
        columns={[
          {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            render: text => <strong>{text}</strong>
          },
          {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: text => <strong>{text}</strong>
          },
          {
            title: 'Status',
            key: 'status',
            render: (text, request) => {
              if (request.status === 'Denied') {
                return <CloseCircleOutlined style={{ color: 'indianred' }} />;
              } else if (request.status === 'Pending') {
                return <HourglassOutlined style={{ color: 'goldenrod' }} />;
              } else {
                return <CheckCircleOutlined style={{ color: 'green' }} />;
              }
            }
          },
          {
            title: 'Delete',
            key: 'delete',
            render: (text, request) => (
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(request._id)} danger />
            )
          }
        ]}
      />
      <Pagination
        total={userRequests.length}
        pageSize={rowsPerPage}
        current={page}
        onChange={handleChangePage}
        showSizeChanger
        pageSizeOptions={['25', '50', '100']}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
});

export default SubmittedRequests;
