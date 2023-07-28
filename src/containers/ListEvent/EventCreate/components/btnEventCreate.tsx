import { AiOutlinePlus } from 'react-icons/ai'
import { HiCalendar } from 'react-icons/hi'

export const BtnEventCreate = ({
  onClick,
}: {
  onClick: () => void
}) => {
  return (
    <div className="input-group fixed bottom-28 right-20 flex-col" onClick={onClick}>
      <div className='flex relative flex-col items-center'>
      <button title='Create New Event' className="btn btn-primary rounded-full w-16 h-16 pt-2 flex justify-center">
        <HiCalendar className="h-8 w-8"/>
        <AiOutlinePlus className='absolute w-4 h-4 bottom-8 right-2 mb-1'/>
      </button>
      </div>
    </div>
  );
};