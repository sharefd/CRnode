import MACIMAHD1Icon from '@/assets/images/mcm.png';
import MACIMAHD2Icon from '@/assets/images/mcm2.png';
import MACIMAHD3Icon from '@/assets/images/mcm3.png';
import OM1Icon from '@/assets/images/om1.png';
import { RocketLaunch } from '@mui/icons-material';

export const purposeIcons = {
  OM1: <img src={OM1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  UOFTAMR: <RocketLaunch sx={{ width: '18px', marginRight: '6px', height: '18px' }} />,
  MACIMAHD1: <img src={MACIMAHD1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD2: <img src={MACIMAHD2Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD3: <img src={MACIMAHD3Icon} style={{ width: '18px', marginRight: '6px' }} />
};
