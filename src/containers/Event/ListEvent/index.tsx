import { useEffect, useState } from "react"
import { getAllEvent } from "../../../services/event"
import { useEventStore } from "../../../store/event"
import { HiGift } from "react-icons/hi"
import { TbGiftOff } from "react-icons/tb"
import { IUser, getAllArtists } from "../../../services/users"
import LoadingPage from "../../../components/Loading"
import Slider from "react-slick"

const settings = {
  focusOnSelect: true,
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  speed: 500
};

export const ListEvent = () => {
  const { events, setEventAll } = useEventStore();
  const [loading, setLoading] = useState<boolean>(false)
  const [ artistAll, setArtistAll ] = useState<IUser[]>([])

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const userArtist = await getAllArtists();
        console.log(userArtist, 'userArtist')
        const events = await getAllEvent();
        if (!events || !userArtist ) return;
        setEventAll(events);
        setArtistAll(userArtist)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto scroll-smooth h-full font-semibold">
    {loading ? <LoadingPage/> :
      <div>
        {artistAll.map((user) => (
          <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-y-8 mb-5">
            { events.find((event) => event["uid"] === user.uid) &&
              <div className="text-left text-xl mt-10">
              Artist: {user.fullname || ""
              }
            </div>}
            <div>
              <Slider {...settings}>
              {events.map((event, index) => {
                if (user.uid !== event.uid) return null;
                return (
                  <div
                    key={index}
                    className="max-w-sm group bg-slate-200 text-black rounded-md overflow-hidden shadow-lg"
                  >
                    <div className="w-auto h-60">
                      <img className="w-full h-full group-hover:scale-105 ease-in duration-200" src={event.coverImage} alt={event.title} loading="lazy"/>
                    </div>
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
              </Slider>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};
