import { Modal } from 'antd';
import { removeUserFromPurpose } from '@/services/purposes';

export const handleRemoveUser = async (user, selectedPurpose, setTargetKeys) => {
  Modal.confirm({
    title: 'Are you sure you want to remove this member?',
    content: `This will remove ${user.username} from ${selectedPurpose.name}.`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      try {
        await removeUserFromPurpose(selectedPurpose.name, user._id);
        toast.success(`Success: Removed ${user.username} from ${selectedPurpose.name}.`, {
          autoClose: 1500,
          pauseOnFocusLoss: false
        });
        setTargetKeys(prevKeys => prevKeys.filter(key => key !== user._id));
      } catch (error) {
        toast.error(`Error while removing ${user.username} from ${selectedPurpose.name}.`, {
          autoClose: 1500,
          pauseOnFocusLoss: false
        });
        console.error('Error removing user:', error);
      }
    },
    onCancel() {}
  });
};
