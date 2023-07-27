import { useEffect, useMemo, useState } from "react";
import { IEvent, getAllEvent } from "../../../services/event";
import { useEventStore } from "../../../store/event";
import { HiGift } from "react-icons/hi";
import { TbGiftOff } from "react-icons/tb";
import { IUser, getAllArtists } from "../../../services/users";

const getAllEventIDs = (events: IEvent[]) => {
  return events.map((event) => ({
    id: event.id,
    fullName: event.createdBy
  }))
};

const displayedFullNames: string[] = [];

export const ListEvent = () => {
  const { events, setEventAll } = useEventStore();
  const [ artistAll, setArtistAll ] = useState<IUser[]>([])
  const eventIds = useMemo(() => {
    return getAllEventIDs(events);
  }, [events]);
  useEffect(() => {
    void (async () => {
      const userArtist = await getAllArtists();
      const events = await getAllEvent();
      if (!events || !userArtist ) return;
      setEventAll(events);
      setArtistAll(userArtist)
    })();
  }, []);

  return (
    <div className="container mx-auto scroll-smooth h-full">
      <div>
        {artistAll.map((user) => (
          <div>
            <div className="text-left text-sm">Artist: {user.fullname || 'Cleopatra'}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-1 gap-x-16 gap-y-4">
              {events.map((event, index) => {
                if (user.uid !== event.uid) return null;
                return (
                  <div>
                    <div
                      key={index}
                      className="bg-slate-500 h-auto h-max-56 mt-2 p-3 rounded-md shadow-sm h-24"
                    >
                      <div className="flex">
                        <div className="w-64">
                          <img className="rounded m-auto w-auto h-40" src={event.coverImage} alt={`${event.title + index}`} />
                        </div>
                        <div className="text-left pl-5">
                          <div className="font-bold lg:text-3xl text-md">{event.title}</div>
                          <div className="text-xs pb-2">{event.description}</div>
                          <div className="grid grid-cols-2 gap-x-3">
                            <div>Created by:</div>{event?.createdBy || 'Unknown'}
                            <div>Event day:</div>
                            {new Date(Number(event?.eventTime?.seconds) * 1000).toLocaleDateString() || null}
                            <div>Ticket Limit: </div>{event.ticketLimit}
                            <div> NFT reward: </div> {event.nftReward ? <HiGift /> : <TbGiftOff />}
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg h-20 w-20 px-3 py-5">
                          subrise
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};
