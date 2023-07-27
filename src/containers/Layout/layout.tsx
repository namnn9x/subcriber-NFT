import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAuth } from '../../hooks'
import { getUser } from '../../services/users'
import { useEffect } from 'react'
import { useUserStore } from '../../store/user'

export const Layout = () => {
  const { user } = useAuth()
  const { setUser } = useUserStore()
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
      </main>
      <Footer />
    </div>
  )
}
