import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthenProvider } from './providers/Authenticator'
import Signin from './containers/Signin'
import Signout from './containers/Signout'
import Signup from './containers/Signup'
import { Layout } from './containers/Layout/layout'
import Event from './containers/Layout/Event'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

function App() {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  )
  return (
    <div className="App">
      <AuthenProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
            <WalletModalProvider>
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
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </AuthenProvider>
    </div>
  )
}

export default App
