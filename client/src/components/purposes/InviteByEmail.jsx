import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from 'react-query';

import { createInvite } from '@/services/invites';
import { fetchUsers } from '@/services/users';

import { Modal, Button, Input, Form, Spin } from 'antd';
import { toast } from 'react-toastify';

const InviteByEmail = ({
  selectedPurpose,
  setSelectedPurpose,
  isEmailModalOpen,
  setEmailModalOpen,
  createRequestMutation,
  refetchPurposes
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [form] = Form.useForm();

  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);
  const [isSending, setIsSending] = useState(false);

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    setEmailInput('');
  };

  const handleExistingUser = async existingUserId => {
    const request = {
      purposeId: selectedPurpose._id,
      userId: existingUserId
    };
    await createRequestMutation.mutateAsync(request);

    refetchPurposes();
    setIsSending(false);
  };

  const handleSubmit = async () => {
    setIsSending(true);

    const existingUser = users.find(user => user.email === emailInput);

    if (existingUser) {
      await handleExistingUser(existingUser._id);
      handleCloseEmailModal();
      return;
    }

    const token = uuidv4();
    // expires  72 hours from now
    const expirationTime = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const fullName = `${selectedPurpose.creator.firstName} ${selectedPurpose.creator.lastName}`;
    const inviteData = {
      email: emailInput,
      creator: fullName,
      calendar: selectedPurpose.name,
      purposeId: selectedPurpose._id,
      token,
      expirationTime
    };

    try {
      await createInvite(inviteData);
      const updatedEmailMemberList = [...selectedPurpose.emailMemberList, emailInput];
      setSelectedPurpose(prev => ({ ...prev, emailMemberList: updatedEmailMemberList }));
      toast.success('Invite sent successfully!');
      handleCloseEmailModal();
    } catch (error) {
      toast.error('Error sending invite. Please try again.');
      handleCloseEmailModal();
    }
    setIsSending(false);
  };

  const handleOk = () => {
    form.submit();
  };

  if (isLoadingUsers) {
    return <Spin />;
  }

  return (
    <div className='mt-auto'>
      <Button onClick={() => setEmailModalOpen(true)}>Invite by email</Button>

      <Modal title='Invite by Email' open={isEmailModalOpen} onCancel={handleCloseEmailModal} onOk={handleOk}>
        <Form form={form} onFinish={handleSubmit}>
          {isSending ? (
            <Spin />
          ) : (
            <Form.Item
              name='email'
              rules={[
                {
                  type: 'email',
                  message: 'The input is not a valid email.'
                },
                {
                  required: true,
                  message: 'Please input your email!'
                }
              ]}>
              <Input
                placeholder='Enter email address'
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default InviteByEmail;
