import { deleteRequest, updateRequest } from '@/services/requests';
import userStore from '@/stores/userStore';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  HourglassOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Modal, Pagination, Progress, Spin, Table, Typography } from 'antd';
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
  const [showUserRequests, setShowUserRequests] = useState(true);
  const [isStatusUpdating, setIsStatusUpdating] = useState(null);

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
      setIsStatusUpdating(id);

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

        setIsStatusUpdating(null);
        handleClose();
      },
      onError: (error, variables) => {
        console.error('There was an error updating the request:', error);

        setIsStatusUpdating(null);
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

  const updateStatus = (id, purposeId, status) => {
    updateStatusMutation.mutate({ id, purpose: purposeId, status });
  };

  if (isQueryLoading || isLoading) {
    return (
      <div className='h-screen w-full items-center justify-center align-middle'>
        <Spin />
      </div>
    );
  }

  const displayedRequests = showUserRequests
    ? requests.filter(req => req.user._id === user._id)
    : localRequests.filter(req => req.user._id !== user._id);

  const columns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      render: purpose => <strong>{purpose && purpose.name}</strong>
    },
//{
//  title: 'Calendar Owner',
//  dataIndex: 'purpose',
//  key: 'purpose.creator',
//  render: purpose => <span>{[purpose.creator].username}</span>
//},

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
                  onClick: () => updateStatus(request._id, request.purpose._id, 'Approved')
                },
                {
                  key: 'deny',
                  label: 'Deny',
                  disabled: request.status === 'Denied',
                  onClick: () => updateStatus(request._id, request.purpose._id, 'Denied')
                },
                {
                  key: 'reset',
                  label: 'Reset',
                  disabled: request.status === 'Pending',
                  onClick: () => updateStatus(request._id, request.purpose._id, 'Pending')
                }
              ];

              return isStatusUpdating === request._id ? (
                <Spin className='ml-1' />
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
                  onClick: () => updateStatus(request._id, request.purpose._id, 'Approved')
                },
                {
                  key: 'deny',
                  label: 'Deny',
                  disabled: request.status === 'Denied',
                  onClick: () => updateStatus(request._id, request.purpose._id, 'Denied')
                }
              ];

              return isStatusUpdating === request._id ? (
                <Spin className='ml-1' />
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
    <Layout className='w-full mx-auto h-screen'>
      <div className='w-full bg-white p-6 min-h-[280px] text-center full-width-mobile'>
        <Button onClick={toggleView} className='mb-5'>
          {!showUserRequests ? 'Incoming Requests' : 'Outgoing Requests'}
        </Button>
        <hr className='my-5' />
        <Typography.Title level={2} className='mb-5'>
          {!showUserRequests ? 'Outgoing Requests' : 'Incoming Requests'}
        </Typography.Title>
        <Table
          dataSource={
            rowsPerPage > 0 ? displayedRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage) : displayedRequests
          }
          pagination={false}
          rowKey={record => record._id}
          columns={columns}
          scroll={{ x: 'max-content' }}
          className='w-full overflow-x-auto'
        />
        <Pagination
          total={localRequests.length}
          pageSize={rowsPerPage}
          current={page}
          onChange={handleChangePage}
          showSizeChanger
          pageSizeOptions={['25', '50', '100']}
          className='mt-5'
        />
      </div>
    </Layout>
  );
});

export default RequestsList;
