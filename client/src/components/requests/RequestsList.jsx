import { fetchRequests, updateRequest } from '@/services/requests';
import userStore from '@/stores/userStore';
import {
  LinearProgress,
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
import { useMutation, useQuery } from 'react-query';
import AccessDenied from '../auth/AccessDenied';

const RequestsList = observer(() => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const user = userStore.user;
  const [isLoading, setIsLoading] = useState(false);

  const { data: requests, isLoading: isRequestQueryLoading, refetch } = useQuery('requests', fetchRequests);

  const updateStatusMutation = useMutation(
    async ({ id, purpose, status }) => {
      setIsLoading(true);
      const updatedRequest = { _id: id, status, email: user.email, purpose };
      await updateRequest(updatedRequest);
    },
    {
      onSuccess: (data, variables) => {
        const updatedRequests = requests.map(request => {
          if (request._id === variables.id) {
            return { ...request, status: variables.status, isApproving: false };
          }
          return request;
        });
        refetch();
        userStore.setSubmittedRequests(updatedRequests.filter(r => r.user._id === user._id));
        setIsLoading(false);
      },
      onError: (error, variables) => {
        console.error('There was an error updating the request:', error);
        const updatedRequests = requests.map(request => {
          if (request._id === variables.id) {
            return { ...request, isApproving: false };
          }
          return request;
        });
        // setRequests(updatedRequests);
        setIsLoading(false);
      }
    }
  );

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

  if (!user || isRequestQueryLoading) {
    return <LinearProgress />;
  } else {
    if (!user.isAdmin) {
      return <AccessDenied />;
    }
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
              <TableCell sx={{ fontWeight: '700' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : requests).map(
              request => (
                <TableRow key={request._id}>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{request.user.username}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.message}</TableCell>

                  <TableCell>
                    <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                  </TableCell>
                  <TableCell>
                    <span className='status-button'>
                      {request.isApproving ? (
                        <LinearProgress />
                      ) : (
                        <>
                          <span
                            className='status-button approve'
                            onClick={() => updateStatus(request._id, request.purpose, 'Approved')}>
                            Approve
                          </span>

                          <span
                            className='status-button deny'
                            onClick={() => updateStatus(request._id, request.purpose, 'Denied')}>
                            Deny
                          </span>

                          <span
                            className='status-button reset'
                            onClick={() => updateStatus(request._id, request.purpose, 'Pending')}>
                            Reset
                          </span>
                        </>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component='div'
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});

export default RequestsList;
