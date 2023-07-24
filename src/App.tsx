import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthenProvider } from './providers/Authenticator'
import Signin from './containers/Signin'
import Signout from './containers/Signout'
import Signup from './containers/Signup'
import { Layout } from './containers/Layout/layout'
import Event from './containers/Layout/Event'

function App() {
  return (
    <div className="App">
      <AuthenProvider>
        <Routes>
          <Route>
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-out" element={<Signout />} />
            <Route path="sign-up" element={<Signup />} />
          </Route>
          <Route path="/" element={<Layout/>}>
            <Route path="/general-event" element={<Event/>} />
          </Route>
        </Routes>
      </AuthenProvider>
    </div>
  )
}

export default App
