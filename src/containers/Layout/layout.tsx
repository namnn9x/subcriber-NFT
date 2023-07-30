import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAuth } from '../../hooks'
import { getUser } from '../../services/users'
import { useEffect } from 'react'
import { useUserStore } from '../../store/user'
import EventLayout from './Event'
import { ROLE } from '../Signup'

export const Layout = () => {
  const { user } = useAuth()
  const { setUser } = useUserStore()
  const { user: currentUser } = useUserStore();
  const location = useLocation()
  const enableCreateEvent = user && location.pathname !== '/company' && currentUser.role !== ROLE.USER

  useEffect(() => {
    if (user?.uid) {
      getUser(user.uid).then((userCre) => {
        console.log(userCre, 'userCre')
        console.log(user.uid)
        if (!userCre) {
          return
        }

        setUser(userCre)
      })
    }

    // eslint-disable-next-line
  }, [user?.uid])

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main>
        <Outlet />
        {enableCreateEvent && <EventLayout/>}
      </main>
      {/* <Footer /> */}
    </div>
  )
}
