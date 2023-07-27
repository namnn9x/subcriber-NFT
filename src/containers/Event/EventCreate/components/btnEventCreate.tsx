import { AiOutlinePlus } from 'react-icons/ai'
import { HiCalendar } from 'react-icons/hi'

export const BtnEventCreate = ({
  onClick,
}: {
  onClick: () => void
}) => {
  return (
    <div className="input-group fixed bottom-6 right-20 flex-col" onClick={onClick}>
      <div className='flex relative flex-col items-center'>
      <button className="btn btn-primary rounded-full w-16 h-16 pt-2 flex justify-center">
        <HiCalendar className="h-8 w-8"/>
        <AiOutlinePlus className='absolute w-4 h-4 bottom-14 right-2 mb-1'/>
      </button>
      <span className="font-bold text-xs pt-2">New Event</span>
      </div>
    </div>
  );
};
