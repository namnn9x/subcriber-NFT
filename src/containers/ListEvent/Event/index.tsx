import { IEvent, getEventById, updateEvent } from '../../../services/event'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
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
      className='w-52 h-80 my-0 mx-auto group bg-slate-900 text-black rounded-md overflow-hidden shadow-2xl relative'
    >
      <div className='w-auto h-36 m-4'>
        <img
          className='w-full h-full group-hover:scale-105 ease-in duration-200 rounded-md'
          src={event.coverImage || '/statics/images/default-img.png'}
          alt={event.title}
          loading='lazy'
        />
      </div>
      <div className='bg-slate-900 h-full'>
        <div className='font-bold text-xl mb-2 text-white'>{event.title || 'Even Name'}</div>
        {/* <div className='text-xs pb-2'>{event.description}</div> */}
        <div className='flex flex-wrap ml-4'>
          <div className=' text-left text-slate-400 pr-2 font-normal'>Event day : </div>
          <div className=' text-left text-slate-400 font-normal'>
            {' '}{new Date(Number(event?.eventTime?.seconds) * 1000).toLocaleDateString() || null}
          </div>
        </div>
        <div className='flex flex-wrap ml-4'>
          <div className=' text-left text-slate-400 pr-2 font-normal'>Ticket Limit :</div>
          <div className=' text-left text-slate-400 font-normal'>{ event.ticketLimit }</div>
        </div>
        {/* <div className='flex flex-wrap'>
          <div className=' text-left text-white'>NFT reward:</div>
          <div className=' text-left flex items-center text-white'>
            { event.nftReward && event.nftReward.length ? <HiGift /> : <TbGiftOff />}
          </div>
        </div> */}
        <div className='justify-around hidden group-hover:flex'>
        {!isMe && <button type='submit' onClick={handleSubscribe} className='px-3 py-5 text-slate-600 text-2xl w-7 h-28 absolute btn-subscriber'>
          <BsFillSuitHeartFill className='btn-subscriber-icon' aria-description='Subscriber'/>
        </button>}
        { isMe && <button
          onClick={handleCreateNFT}
          type='submit'
          className='tex btn-lg px-3 py-5 text-slate-600 text-2xl'
        >
          <IoIosAddCircleOutline className='hover:text-white' aria-description='Create NFT'/>
        </button>}
      </div>
      </div>
    </div>
  )
}
