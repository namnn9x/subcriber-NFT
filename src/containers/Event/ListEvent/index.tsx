import { useEffect, useMemo, useState } from "react";
import { IEvent, getAllEvent } from "../../../services/event";
import { useEventStore } from "../../../store/event";
import { HiGift } from "react-icons/hi";
import { TbGiftOff } from "react-icons/tb";
import { IUser, getAllArtists } from "../../../services/users";

const getAllEventIDs = (events: IEvent[]) => {
  return events.map((event) => ({
    id: event.id,
    fullName: event.createdBy,
  }));
};

const displayedFullNames: string[] = [];

export const ListEvent = () => {
  const { events, setEventAll } = useEventStore();
  const [artistAll, setArtistAll] = useState<IUser[]>([]);
  const eventIds = useMemo(() => {
    return getAllEventIDs(events);
  }, [events]);
  useEffect(() => {
    void (async () => {
      const userArtist = await getAllArtists();
      const events = await getAllEvent();
      if (!events || !userArtist) return;
      setEventAll(events);
      setArtistAll(userArtist);
    })();
  }, []);

  return (
    <div className="container mx-auto scroll-smooth h-full font-semibold">
      <div>
        {artistAll.map((user) => (
          <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-y-8">
            <div className="text-left text-xl mt-10">
              Artist: {user.fullname || "Cleopatra"}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-1 gap-x-10 gap-y-4">
              {events.map((event, index) => {
                if (user.uid !== event.uid) return null;
                return (
                  <div
                    key={index}
                    className="max-w-sm bg-slate-200 text-black rounded-md overflow-hidden shadow-lg"
                  >
                    <img className="w-full" src={event.coverImage} />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">
                        {event.title}
                      </div>
                      <div className="text-xs pb-2">{event.description}</div>
                      <div className="flex flex-wrap">
                        <div className="w-1/3 ml-auto text-left">Created by:</div>
                        <div className="w-1/3 mr-auto text-left">
                          {event?.createdBy || "Unknown"}
                        </div>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="w-1/3 ml-auto text-left">Event day:</div>
                        <div className="w-1/3 mr-auto text-left">
                          {new Date(
                            Number(event?.eventTime?.seconds) * 1000
                          ).toLocaleDateString() || null}
                        </div>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="w-1/3 ml-auto text-left">Ticket Limit: </div>
                        <div className="w-1/3 mr-auto text-left">{event.ticketLimit}</div>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="w-1/3 ml-auto text-left">NFT reward:</div>
                        <div className="w-1/3 mr-auto text-left flex items-center">
                          {event.nftReward ? <HiGift /> : <TbGiftOff />}
                        </div>
                      </div>
                    </div>
                    <div className="px-3 pb-5">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg h-10 w-20 px-3 py-5"
                      >
                        Subrise
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
