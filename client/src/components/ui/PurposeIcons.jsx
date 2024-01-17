import { MonitorHeart, PeopleAlt, RocketLaunch, Engineering, Vaccines, } from '@mui/icons-material';
import MACIMAHD1Icon from '@/assets/images/mcm.png';
import MACIMAHD2Icon from '@/assets/images/mcm2.png';
import MACIMAHD3Icon from '@/assets/images/mcm3.png';
import OM1Icon from '@/assets/images/om1-purple.png';
import { GiPoisonBottle } from "react-icons/gi";


const purposeIcons = {
  OM1: <img src={OM1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  UOFTAMR: <RocketLaunch sx={{ width: '18px', marginRight: '6px', height: '18px' }} />,
  MACIMAHD1: <img src={MACIMAHD1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD2: <img src={MACIMAHD2Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD3: <img src={MACIMAHD3Icon} style={{ width: '18px', marginRight: '6px' }} />,
  DEFAULT: <PeopleAlt sx={{ width: '18px', marginRight: '0px', height: '18px', color: '#5161ce' }} />,
  'Occ Med AHD': <img src={OM1Icon} style={{ width: '18px', marginRight: '0px' }} />,
  'SMH Occ Med Rounds': <Engineering sx={{ width: '18px', marginRight: '0px', height: '18px', color: '#5161ce' }} />,
  'UofT Aerospace': <RocketLaunch sx={{ width: '18px', marginRight: '0px', height: '18px', color: '#5161ce' }} />,
  'UofT Tox Rounds': <Vaccines sx={{ width: '18px', marginRight: '0px', height: '18px', color: '#5161ce' }} />,
  'PHRI Cardiology Rounds': <MonitorHeart sx={{ width: '18px', marginRight: '0px', height: '18px', color: '#5161ce' }} />,
    
    

};



export default purposeIcons;
