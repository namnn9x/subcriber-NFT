import { useMemo } from "react";
import { IEvent } from "../../../services/event";
import { useEventStore } from "../../../store/event";

const getAllEventIDs = (events: IEvent[]) => {
  return events.map((item) => item.id);
};

export const ListEvent = () => {
  const { events } = useEventStore();

  const eventIds = useMemo(() => {
    return getAllEventIDs(events);
  }, [events]);

  return (
    <div>
      {eventIds.map((id) => (
        <div>
          {events.map((event, index) => {
            if (event.id !== id) return null;
            return (
             <div>
             <div className="text-left text-sm">Artist: {event.createdBy || 'Cleopatra'}</div>
              <div
                key={index}
                className="bg-white mt-2 p-3 rounded-md shadow-sm h-24"
              >
               <div>
                 <div>{event.title}</div>
                 <div>{event.description}</div>
                 <div>{event?.eventTime?.toString() || null}</div>
                 <div>{event.ticketLimit}</div>
               </div>
              </div>
             </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
