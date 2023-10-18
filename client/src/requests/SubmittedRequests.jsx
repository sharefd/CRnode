import { useState, useEffect } from 'react';
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

const SubmittedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = useRecoilValue(userState);

  useEffect(() => {
    axios.get('http://localhost:3001/api/requests').then(response => {
      const userRequests = response.data.filter(request => request.user._id === user._id);
      setRequests(userRequests);
    });
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '80%', margin: '0 auto', mt: 5 }}>
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
          My Submitted Requests
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : requests).map(
              request => (
                <TableRow key={request._id}>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>
                    <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                  </TableCell>
                  <TableCell>{request.message}</TableCell>
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

export default SubmittedRequests;
