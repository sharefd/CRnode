import userStore from '@/stores/userStore';

export const canCreate = () => {
  if (!userStore.permissions) return;
  return userStore.permissions.some(p => p.canWrite);
};
