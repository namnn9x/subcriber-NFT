import { useEffect, useState } from "react"
import { IEvent } from "../../services/event"
import { FaRankingStar } from 'react-icons/fa6'

function classNames(...classes: any) {
 return classes.filter(Boolean).join(' ')
}

export const ListTopEvent = ({ events }: {
 events: IEvent[]
}) => {
 const [topEvents, setTopEvents] = useState<IEvent[]>([]);

 useEffect(() => {
  if (events && events.length > 0) {
   // Sort the events in descending order based on the registration count
   const sortedEvents = [...events].sort((a, b) => b.subscriberId?.length - a.subscriberId?.length);
   const top4Events = sortedEvents.slice(0, 4);
   const sortUndefined = top4Events.filter((event) => Boolean(event.subscriberId)).map((item) => item)
   setTopEvents(sortUndefined);
  }
 }, [events]);

 console.log(events, 'events')
 console.log(topEvents, 'topEvents')
 return (
  <div className="list-top-event">
   <div className="flex items-center mt-10">
     <h2 className="text-2xl font-bold text-center text-white pr-3">Top Event</h2>
     <FaRankingStar className="top-event-icon"/>
   </div>
   <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
    {topEvents.map((event) => (
     <li key={event.id} className="col-span-1 flex rounded-md shadow-sm">
      <div
       className={'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'}
      >
       <img
        src={event.coverImage}
        alt={event.title}
        loading='lazy'
        className='h-full w-full object-cover object-center group-hover:scale-105 ease-in duration-200'
       />
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md bg-slate-900">
       <div className="flex-1 truncate px-4 py-2 text-sm">
        <a className="font-medium text-yellow-50">
         {event.title}
        </a>
        <p className="text-yellow-50">{event.subscriberId && event.subscriberId.length} Members</p>
       </div>
       <div className="flex-1 truncate px-4 py-2 text-sm">
        <p className="text-white">{event.createdBy}</p>
       </div>
      </div>
     </li>
    ))}
   </ul>
  </div>
 )
}