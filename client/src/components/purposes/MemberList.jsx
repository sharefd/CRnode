import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';

const MemberList = ({ selectedPurpose }) => {
  return (
    <TableContainer>
      <Typography variant='h5' align='left' sx={{ padding: '1rem', mb: 2 }}>
        Members
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Member</TableCell>
            <TableCell>Can View</TableCell>
            <TableCell>Can Write</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedPurpose &&
            selectedPurpose.canReadMembers.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.username}</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>
                  {selectedPurpose.canWriteMembers.find(m => m._id === member._id.toString()) ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>
                  <Button variant='outlined' color='primary' onClick={() => handleEditMembers(selectedPurpose)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default MemberList;
