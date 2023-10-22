import {
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
import axios from 'axios';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import userStore from '@/stores/userStore';
import LoadingSpinner from '../../helpers/LoadingSpinner';

const SubmittedRequests = observer(({ resource }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = userStore.user;
  const allRequests = resource.read();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    console.log(allRequests.find(r => !r.user));
    userStore.setSubmittedRequests(allRequests.filter(request => request.user && request.user._id === user._id));
    setIsLoading(false);
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Paper sx={{ width: '60%', margin: '0 auto', mt: 5 }}>
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
              <TableCell sx={{ fontWeight: '700' }}>Level</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? userStore.submittedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : userStore.submittedRequests
            ).map(request => (
              <TableRow key={request._id}>
                <TableCell>{request.purpose}</TableCell>

                <TableCell>{request.year_of_study}</TableCell>

                <TableCell>{request.message}</TableCell>
                <TableCell>
                  <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={userStore.submittedRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});

export default SubmittedRequests;
