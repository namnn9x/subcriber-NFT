import { Fragment, useEffect, useState } from 'react'
import { IEvent, getAllEvent } from '../../services/event'
import { useEventStore } from '../../store/event'
import { IUser, getAllArtists } from '../../services/users'
import LoadingPage from '../../components/Loading'
import Slider from 'react-slick'
import { NFTCreate } from '../NFTs/NFTCreate'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Event } from './Event'
import { useUserStore } from '../../store/user'

const settings = {
  focusOnSelect: false,
  infinite: false,
  slidesToShow: 3,
  touchMove: false,
  slidesToScroll: 1,
  speed: 500,
}

export const ListEvent = () => {
  const { user: currentUser } = useUserStore();
  const { events, setEventAll } = useEventStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [artistAll, setArtistAll] = useState<IUser[]>([])
  const [ currentEvent, setCurrentEvent] = useState<IEvent>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const handleCreateNFT = (event: IEvent) => {
    if (connected) {
      setCurrentEvent(event)
      setIsOpen(true)
    } else {
      setVisible(true)
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const userArtist = await getAllArtists()
        console.log(userArtist, 'userArtist')
        const events = await getAllEvent()
        console.log(events,'events')
        if (!events || !userArtist) return
        setEventAll(events)
        setArtistAll(userArtist)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      <div className='container mx-auto scroll-smooth h-full font-semibold'>
        {loading ? (
          <LoadingPage />
        ) : (
          <div>
            {artistAll.map((user: IUser) => {
              if (user.uid === currentUser.uid) return
              return (
                <div className='grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-y-8 mb-5'>
                  {events.find((event) => event['uid'] === user.uid) && (
                    <div className='text-left text-xl mt-10'>Artist: {user.fullname || ''}</div>
                  )}
                  <div className=''>
                    <Slider {...settings} centerPadding='50px'>
                      {events.map((event: IEvent, index: number) => {
                        if (user.uid !== event.uid) return
                        return (
                          <Fragment key={index}>
                              {<Event event={event} handleCreateNFT={() => handleCreateNFT(event)}/>}
                          </Fragment>
                        )})}
                    </Slider>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <NFTCreate isOpen={isOpen} setIsOpen={setIsOpen} event={currentEvent}/>
    </>
  )
}
