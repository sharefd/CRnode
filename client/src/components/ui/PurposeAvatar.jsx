import { hashStringToColor, createAcronym } from '@/utils/cardHelpers';
import { Avatar } from 'antd';

const PurposeAvatar = ({ purpose = 'N/A' }) => {
  const bgColor = hashStringToColor(purpose);
  const acronym = createAcronym(purpose);

  return <Avatar style={{ backgroundColor: bgColor }}>{acronym}</Avatar>;
};

export default PurposeAvatar;
