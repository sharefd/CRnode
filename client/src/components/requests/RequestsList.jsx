import { deleteRequest, updateRequest } from '@/services/requests';
import userStore from '@/stores/userStore';
import { CheckCircle, Delete, DoNotDisturb, HourglassEmpty, MoreHoriz } from '@mui/icons-material';
import {
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import useRequestPermissions from '@/hooks/useRequestPermissions';

const RequestsList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { allowedRequests, purposes, canWritePurposes, isLoading: isQueryLoading } = useRequestPermissions(user._id);

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
    deleteMutation.mutate(requestId);
  };

  const updateStatusMutation = useMutation(
    async ({ id, purpose, status }) => {
      setIsLoading(true);
      const updatedRequest = { _id: id, status, email: user.email, purpose };
      await updateRequest(updatedRequest);
    },
    {
      onSuccess: (data, variables) => {
        const updatedRequests = allowedRequests.map(request => {
          if (request._id === variables.id) {
            return { ...request, status: variables.status, isApproving: false };
          }
          return request;
        });
        refetch();
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

  const handleClick = (event, requestId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenMenuId(requestId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 25));
    setPage(0);
  };

  const updateStatus = (id, purpose, status) => {
    updateStatusMutation.mutate({ id, purpose, status });
  };

  if (!user || isQueryLoading || isLoading) {
    return <LinearProgress />;
  }

  return (
    <Paper sx={{ width: '80%', margin: '0 auto', mt: 3 }}>
      <TableContainer>
        <Typography
          variant='h5'
          align='left'
          sx={{
            backgroundColor: '#0066b2',
            color: 'white',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px',
            padding: '1rem',
            mb: 2
          }}>
          Requests
        </Typography>
        {isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>User</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Actions</TableCell>
              <TableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700', textAlign: 'center' }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? allowedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : allowedRequests
            ).map(request => (
              <TableRow key={request._id}>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <div>
                    <p style={{ padding: 0, margin: 0, fontSize: '12px' }}>{request.user.username}</p>
                    <span style={{ padding: 0, margin: 0, fontSize: '12px', color: 'blue' }}>{request.email}</span>
                  </div>
                </TableCell>
                <TableCell>{request.message}</TableCell>

                <TableCell>
                  {request.isApproving ? (
                    <LinearProgress />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <IconButton onClick={e => handleClick(e, request._id)} sx={{ p: 0, m: 0 }}>
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={openMenuId === request._id ? anchorEl : null}
                        keepMounted
                        open={openMenuId === request._id}
                        onClose={handleClose}>
                        <MenuItem
                          className='status-button approve'
                          onClick={() => updateStatus(request._id, request.purpose, 'Approved')}
                          disabled={request.status === 'Approved'}>
                          Approve
                        </MenuItem>

                        <MenuItem
                          className='status-button deny'
                          onClick={() => updateStatus(request._id, request.purpose, 'Denied')}
                          disabled={request.status === 'Denied'}>
                          Deny
                        </MenuItem>

                        <MenuItem
                          className='status-button reset'
                          onClick={() => updateStatus(request._id, request.purpose, 'Pending')}
                          disabled={request.status === 'Pending'}>
                          Reset
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {request.status === 'Denied' ? (
                    <DoNotDisturb sx={{ opacity: '0.5', color: 'indianred' }} />
                  ) : request.status === 'Pending' ? (
                    <HourglassEmpty sx={{ opacity: '0.5', color: 'goldenrod' }} />
                  ) : (
                    <CheckCircle sx={{ opacity: '0.5', color: 'green' }} />
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleDelete(request._id)} color='error'>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component='div'
        count={allowedRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});

export default RequestsList;
