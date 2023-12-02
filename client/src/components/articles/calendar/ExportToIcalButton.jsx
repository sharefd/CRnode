import { DownloadOutlined } from '@ant-design/icons';
import { createEvent } from 'ics';
import { extractTimesFromDuration } from '@/utils/dates';
import dayjs from 'dayjs';

const ExportToIcalButton = ({ article, text, fontSize }) => {
  const createIcsFile = event => {
    const { title, date, duration, location } = event;
    const [startTime, endTime] = extractTimesFromDuration(duration);

    const startDate = dayjs(date).hour(startTime.hour()).minute(startTime.minute());
    const endDate = dayjs(date).hour(endTime.hour()).minute(endTime.minute());

    createEvent(
      {
        title: title,
        start: [startDate.year(), startDate.month() + 1, startDate.date(), startDate.hour(), startDate.minute()],
        end: [endDate.year(), endDate.month() + 1, endDate.date(), endDate.hour(), endDate.minute()],
        location: location
      },
      (error, value) => {
        if (error) {
          console.log(error);
        } else {
          const blob = new Blob([value], { type: 'text/calendar;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${title}.ics`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    );
  };

  return (
    <div
      onClick={() => createIcsFile(article)}
      className='flex items-center cursor-pointer basic-btn red-full px-2 py-[3px] hover:bg-purple-100 rounded-md'>
      <DownloadOutlined className='text-md text-[#f47d7f]' />
      <p className='ml-1 text-[#f47d7f]' style={{ fontWeight: 700, fontFamily: 'sans-serif', fontSize: '12px' }}>
        {text ? text : 'iCal'}
      </p>
    </div>
  );
};
export default ExportToIcalButton;
