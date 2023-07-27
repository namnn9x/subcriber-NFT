import { useEffect, useMemo } from "react";
import { IEvent, getAllEvent } from "../../../../services/event";
import { useEventStore } from "../../../../store/event";

const getAllEventIDs = (events: IEvent[]) => {
  return events.map((event) => ({
    id: event.id,
    fullName: event.createdBy
  }))
};

export const ListEvent = () => {
  const { events, setEventAll } = useEventStore();
  const eventIds = useMemo(() => {
    return getAllEventIDs(events);
  }, [events]);
  console.log(eventIds, 'eventIds')
  useEffect(() => {
    void (async () => {
      const events = await getAllEvent();
      if (!events) return null;
      console.log(events, "events");
      setEventAll(events);
    })();
  }, []);

  return (
    <></>
    // <div>
    //   {eventIds.map((event) => (
    //     <div>
    //       <div className="text-left text-sm">Artist: {event.fullName || 'Cleopatra'}</div>
    //       {events.map((event, index) => {
    //         if (event.id !== event.id) return null;
    //         return (
    //          <div>
    //           <div
    //             key={index}
    //             className="bg-white mt-2 p-3 rounded-md shadow-sm h-24"
    //           >
    //            <div>
    //              <div>{event.title}</div>
    //              <div>{event.description}</div>
    //              <div>{event?.eventTime?.toString() || null}</div>
    //              <div>{event.ticketLimit}</div>
    //            </div>
    //           </div>
    //          </div>
    //         );
    //       })}
    //     </div>
    //   ))}
    // </div>
  )
};
