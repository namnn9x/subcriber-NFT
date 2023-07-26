import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../libs/firebase'
import { useNavigate } from 'react-router-dom'

export interface IAuthenUser {
  email: string | null
  displayName: string | null
  uid: string
  photoURL: string | null
}

interface IAuthenContext {
  checking: boolean
  user: IAuthenUser | null
}

export const AuthenContext = createContext<IAuthenContext>({
  checking: true,
  user: null,
})

interface AuthenProviderProps {
  children: JSX.Element | JSX.Element[]
}
export const AuthenProvider = ({ children }: AuthenProviderProps) => {
  const [authInfo, setAuthInfo] = useState<IAuthenContext>({
    checking: true,
    user: null,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthInfo({
          checking: false,
          user: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
          },
        })
      } else {
        setAuthInfo({
          checking: false,
          user: null,
        })
        navigate('/sign-in')
      }
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line
  }, [])

  return <AuthenContext.Provider value={authInfo}>{children}</AuthenContext.Provider>
}
