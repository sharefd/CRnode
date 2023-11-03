import { deleteRequest, updateRequest } from '@/services/requests';
import userStore from '@/stores/userStore';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  HourglassOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Modal, Pagination, Progress, Table, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import useRequestPermissions from '@/hooks/useRequestPermissions';

const { Content } = Layout;

const RequestsList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localRequests, setLocalRequests] = useState([]);

  const { requests, allowedRequests, isLoading: isQueryLoading, refetch } = useRequestPermissions();
  const [showUserRequests, setShowUserRequests] = useState(false);

  useEffect(() => {
    if (isQueryLoading) return;
    setLocalRequests(allowedRequests);
  }, [isQueryLoading, allowedRequests]);

  const deleteMutation = useMutation(deleteRequest, {
    onSuccess: (data, variables) => {
      refetch();
      userStore.setSubmittedRequests(userStore.submittedRequests.filter(request => request._id !== variables));
    },
    onError: error => {
      console.error('Error deleting request:', error);
    }
  });

  const handleDelete = requestId => {
    Modal.confirm({
      title: 'Are you sure you want to delete this request?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteMutation.mutate(requestId);
      },
      onCancel() {
        return;
      }
    });
  };

  const updateStatusMutation = useMutation(
    async ({ id, purpose, status }) => {
      setIsLoading(true);
      const updatedRequest = { _id: id, status, email: user.email, purpose };
      await updateRequest(updatedRequest);
    },
    {
      onSuccess: (data, variables) => {
        const updatedRequests = localRequests.map(request => {
          if (request._id === variables.id) {
            return { ...request, status: variables.status, isApproving: false };
          }
          return request;
        });
        refetch();
        setLocalRequests(updatedRequests);
        userStore.setSubmittedRequests(updatedRequests.filter(r => r.user._id === user._id));
        setIsLoading(false);
        handleClose();
      },
      onError: (error, variables) => {
        console.error('There was an error updating the request:', error);
        setIsLoading(false);
        handleClose();
      }
    }
  );

  const handleClose = () => {
    setOpenMenuId(null);
  };

  const handleChangePage = (newPage, newRowsPerPage) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 25));
    setPage(0);
  };

  const toggleView = () => {
    setShowUserRequests(!showUserRequests);
  };

  const updateStatus = (id, purpose, status) => {
    updateStatusMutation.mutate({ id, purpose, status });
  };

  if (isQueryLoading || isLoading) {
    return <Progress percent={100} status='active' />;
  }

  const displayedRequests = showUserRequests
    ? requests.filter(req => req.user._id === user._id)
    : localRequests.filter(req => req.user._id !== user._id);

  const columns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: user => (
        <div>
          <p style={{ padding: 0, margin: 0, fontSize: '12px' }}>{user.username}</p>
          <span style={{ padding: 0, margin: 0, fontSize: '12px', color: 'blue' }}>{user.email}</span>
        </div>
      )
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: text => <strong>{text}</strong>
    },
    ...(!showUserRequests
      ? [
          {
            title: 'Actions',
            key: 'actions',
            render: (text, request) => {
              const menuItems = [
                {
                  key: 'approve',
                  label: 'Approve',
                  disabled: request.status === 'Approved',
                  onClick: () => updateStatus(request._id, request.purpose, 'Approved')
                },
                {
                  key: 'deny',
                  label: 'Deny',
                  disabled: request.status === 'Denied',
                  onClick: () => updateStatus(request._id, request.purpose, 'Denied')
                },
                {
                  key: 'reset',
                  label: 'Reset',
                  disabled: request.status === 'Pending',
                  onClick: () => updateStatus(request._id, request.purpose, 'Pending')
                }
              ];

              return request.isApproving ? (
                <Progress percent={100} status='active' />
              ) : (
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              );
            }
          }
        ]
      : [
          {
            title: 'Actions',
            key: 'actions',
            render: (text, request) => {
              const menuItems = [
                {
                  key: 'approve',
                  label: 'Approve',
                  disabled: request.status === 'Approved',
                  onClick: () => updateStatus(request._id, request.purpose, 'Approved')
                },
                {
                  key: 'deny',
                  label: 'Deny',
                  disabled: request.status === 'Denied',
                  onClick: () => updateStatus(request._id, request.purpose, 'Denied')
                }
              ];

              return request.isApproving ? (
                <Progress percent={100} status='active' />
              ) : (
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              );
            }
          }
        ]),
    {
      title: 'Status',
      key: 'status',
      width: '15%',
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
      width: '20%',
      render: (text, request) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(request._id)}
          danger
          className='hover:bg-red-500 cancel-request-btn'
        />
      )
    }
  ];

  return (
    <Layout style={{ width: '100%', margin: '0 auto', height: '100vh' }}>
      <Content style={{ padding: '10px 80px', marginTop: '64px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center' }}>
          <Button onClick={toggleView}>{showUserRequests ? 'Access Requests' : 'Invitations'}</Button>
          <hr style={{ margin: '20px 0' }} />
          <Typography.Title level={2}>{showUserRequests ? 'My Requests' : 'Incoming Requests'}</Typography.Title>
          {isLoading && <Progress percent={100} status='active' />}
          <Table
            dataSource={
              rowsPerPage > 0
                ? displayedRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage)
                : displayedRequests
            }
            pagination={false}
            rowKey={record => record._id}
            columns={columns}
            scroll={{ x: 'max-content' }}
          />
          <Pagination
            total={localRequests.length}
            pageSize={rowsPerPage}
            current={page}
            onChange={handleChangePage}
            showSizeChanger
            pageSizeOptions={['25', '50', '100']}
            style={{ marginTop: '20px' }}
          />
        </div>
      </Content>
    </Layout>
  );
});

export default RequestsList;
