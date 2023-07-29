import { Fragment, useEffect, useState } from 'react'
import Pagination from "rc-pagination"
import "rc-pagination/assets/index.css"
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

interface Props {
  isMe?: boolean
}
const settings = {
  focusOnSelect: false,
  infinite: false,
  slidesToShow: 6,
  touchMove: false,
  slidesToScroll: 1,
  speed: 500,
}

export const ListEvent = ({ isMe = false }: Props) => {
  const { user: currentUser } = useUserStore();
  const { events, setEventAll } = useEventStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [artistAll, setArtistAll] = useState<IUser[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [artistCurrent, setArtistCurrentPage] = useState<IUser[]>()
  const [currentEvent, setCurrentEvent] = useState<IEvent>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const countPerPage = 2
  const handleCreateNFT = (event: IEvent) => {
    if (connected) {
      setCurrentEvent(event)
      setIsOpen(true)
    } else {
      setVisible(true)
    }
  }

  const updatePage = (p: number) => {
    setCurrentPage(p)
    const to = countPerPage * p
    const from = to - countPerPage
    setArtistCurrentPage(artistAll.slice(from, to))
  }

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const userArtists = await getAllArtists()
        const events = await getAllEvent()
        if (!events || !userArtists) return
        const eventUID = events.map(event => event.uid)
        const artistFilter = userArtists
        setEventAll(events)
        setArtistAll(artistFilter)
        setArtistCurrentPage(artistFilter)

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
        ) : (artistCurrent && artistCurrent.length &&
          <div>
            {
              artistCurrent.filter(user => isMe ? user.uid === currentUser.uid : user.uid !== currentUser.uid).map((user: IUser) => {
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
                              {<Event event={event} handleCreateNFT={() => handleCreateNFT(event)} isMe={isMe} />}
                            </Fragment>
                          )
                        })}
                      </Slider>
                    </div>
                  </div>
                )
              })}

            {/* {!isMe && artistAll && artistAll.length &&
              <div className='pb-10 pt-4 relative'>
                <Pagination
                  pageSize={countPerPage}
                  onChange={updatePage}
                  current={currentPage}
                  total={artistAll.filter(user => user.uid !== currentUser.uid).length}
                />
              </div>} */}
          </div>
        )}
      </div>
      <NFTCreate isOpen={isOpen} setIsOpen={setIsOpen} event={currentEvent} />
    </>
  )
}
