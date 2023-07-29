import { IEvent, getEventById, updateEvent } from '../../../services/event'
import { HiGift } from 'react-icons/hi'
import { TbGiftOff } from 'react-icons/tb'
import { useUserStore } from '../../../store/user'
import { useEventStore } from '../../../store/event'

interface Props {
  event: IEvent
  handleCreateNFT: () => void
  isMe: boolean
}

export const Event = ({event, handleCreateNFT, isMe} : Props) => {
  const { user: currentUser } = useUserStore();
  const { updateEventStore } = useEventStore();

  const handleSubscribe = async () => {
    if (!event.id || !currentUser.uid) return
  
    const resEvent = await getEventById(event.id) as IEvent
    const nftReward = resEvent.nftReward
    const mint = nftReward[Math.floor(Math.random()*nftReward.length)];

    // Save id user subscriber

    const newEvent: IEvent = {
      ...resEvent,
      subscriberId: [ ...resEvent.subscriberId, currentUser.uid]
    }
    
    await updateEvent({ newEvent })
    updateEventStore(event.id, newEvent)
  }

  return (
    <div
      className='max-w-xs my-0 mx-auto group bg-slate-200 text-black rounded-md overflow-hidden shadow-lg'
    >
      <div className='w-auto h-60'>
        <img
          className='w-full h-full group-hover:scale-105 ease-in duration-200'
          src={event.coverImage || '/statics/images/default-img.png'}
          alt={event.title}
          loading='lazy'
        />
      </div>
      <div className='px-6 py-6'>
        <div className='font-bold text-xl mb-2'>{event.title || 'Even Name'}</div>
        <div className='text-xs pb-2'>{event.description}</div>
        <div className='flex flex-wrap'>
          <div className='w-1/3 ml-auto text-left'>Created by:</div>
          <div className='w-1/3 mr-auto text-left'>{event?.createdBy || 'Unknown'}</div>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-1/3 ml-auto text-left'>Event day:</div>
          <div className='w-1/3 mr-auto text-left'>
            {new Date(Number(event?.eventTime?.seconds) * 1000).toLocaleDateString() || null}
          </div>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-1/3 ml-auto text-left'>Ticket Limit: </div>
          <div className='w-1/3 mr-auto text-left'>{event.ticketLimit}</div>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-1/3 ml-auto text-left'>NFT reward:</div>
          <div className='w-1/3 mr-auto text-left flex items-center'>
            { event.nftReward && event.nftReward.length ? <HiGift /> : <TbGiftOff />}
          </div>
        </div>
      </div>
      <div className='px-3 pb-5 flex justify-around'>
        {!isMe && <button type='submit' onClick={handleSubscribe} className='btn btn-primary btn-lg h-10 w-28 px-3 py-5'>
          Subscribe
        </button>}
        {isMe && <button
          onClick={handleCreateNFT}
          type='submit'
          className='btn btn-primary btn-lg h-10 w-28 px-3 py-5'
        >
          Create NFT
        </button>}
      </div>
    </div>
  )
}
