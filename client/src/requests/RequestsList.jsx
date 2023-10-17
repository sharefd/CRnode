import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userState } from '../appState';

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = useRecoilValue(userState);

  useEffect(() => {
    axios.get('http://localhost:3001/api/requests').then(response => {
      setRequests(response.data);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateStatus = (id, status) => {
    const data = { status, email: user.email };
    axios
      .put(`http://localhost:3001/api/requests/${id}/status`, data)
      .then(response => {
        const updatedRequests = requests.map(request => {
          if (request._id === id) {
            return { ...request, status };
          }
          return request;
        });
        setRequests(updatedRequests);
      })
      .catch(error => {
        console.error('There was an error updating the request:', error);
      });
  };

  return (
    <Paper sx={{ width: '80%', margin: '0 auto', mt: 5 }}>
      <TableContainer>
        <Typography
          variant='h5'
          align='left'
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px',
            padding: '1rem',
            mb: 2
          }}>
          Requests
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>User</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Message</TableCell>
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
                  <TableCell>
                    <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                  </TableCell>
                  <TableCell>{request.message}</TableCell>
                  <TableCell>
                    <span className='status-button approve' onClick={() => updateStatus(request._id, 'Approved')}>
                      Approve
                    </span>
                    <span className='status-button deny' onClick={() => updateStatus(request._id, 'Denied')}>
                      Deny
                    </span>
                    <span className='status-button reset' onClick={() => updateStatus(request._id, 'Pending')}>
                      Reset
                    </span>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RequestsList;
