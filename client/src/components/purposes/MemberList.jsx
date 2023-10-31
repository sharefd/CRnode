import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useQuery } from 'react-query';
import { fetchAndPopulatePurpose, deleteUserFromPurpose } from '@/services/purposes';
import { useEffect, useState } from 'react';

const MemberList = ({ selectedPurpose }) => {
  const [localPurpose, setLocalPurpose] = useState(null);

  const {
    data: purpose,
    isLoading: isLoadingPurpose,
    refetch
  } = useQuery('purpose', () => fetchAndPopulatePurpose(selectedPurpose._id));

  useEffect(() => {
    setLocalPurpose(purpose);
  }, [purpose]);

  const handleCheckboxChange = async (member, permissionType) => {
    const updatedPurpose = { ...purpose };
    if (permissionType === 'canRead') {
      const exists = updatedPurpose.canReadMembers.find(m => m._id === member._id);
      if (exists) {
        updatedPurpose.canReadMembers = updatedPurpose.canReadMembers.filter(m => m._id !== member._id);
      } else {
        updatedPurpose.canReadMembers.push(member);
      }
    } else {
      const exists = updatedPurpose.canWriteMembers.find(m => m._id === member._id);
      if (exists) {
        updatedPurpose.canWriteMembers = updatedPurpose.canWriteMembers.filter(m => m._id !== member._id);
      } else {
        updatedPurpose.canWriteMembers.push(member);
      }
    }

    setLocalPurpose(updatedPurpose);
  };

  const handleDeleteMember = async (member, purposeId) => {
    if (window.confirm(`Are you sure you want to remove ${member.username} from this purpose?`)) {
      await deleteUserFromPurpose(member._id, purposeId);
      const canWriteMembers = localPurpose.canWriteMembers.filter(m => m._id !== member._id);
      const canReadMembers = localPurpose.canReadMembers.filter(m => m._id !== member._id);
      setLocalPurpose({ ...localPurpose, canWriteMembers, canReadMembers });
      refetch();
    }
  };

  if (isLoadingPurpose) {
    return <LinearProgress />;
  }

  return (
    <TableContainer>
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
          {purpose &&
            purpose.canReadMembers.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.username}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!purpose.canReadMembers.find(m => m._id === member._id)}
                    onChange={() => handleCheckboxChange(member, 'canRead')}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!purpose.canWriteMembers.find(m => m._id === member._id)}
                    onChange={() => handleCheckboxChange(member, 'canWrite')}
                  />
                </TableCell>
                <TableCell>
                  <IconButton sx={{ color: 'indianred' }} onClick={() => handleDeleteMember(member, purpose._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default MemberList;
