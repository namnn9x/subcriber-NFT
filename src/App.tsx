import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthenProvider } from './providers/Authenticator'
import Signin from './containers/Signin'
import Signout from './containers/Signout'
import Signup from './containers/Signup'
import { Layout } from './containers/Layout/layout'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import NFTList from './containers/NFTs'
import { Network, ShyftSdk } from '@shyft-to/js'
import Company from './containers/Company'
import { ListEvent } from './containers/ListEvent'

export const shyft = new ShyftSdk({ apiKey: process.env.REACT_APP_SHYFT_API_KEY!, network: Network.Devnet })

function App() {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  return (
    <div className="App">
      <AuthenProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
            <WalletModalProvider>
              <Routes>
                <Route>
                  <Route path="sign-in" element={<Signin />} />
                  <Route path="sign-out" element={<Signout />} />
                  <Route path="sign-up" element={<Signup />} />
                </Route>
                <Route path="/" element={<Layout />}>
                  <Route path="/general-event" element={<ListEvent />} />
                  <Route path="/nfts" element={<NFTList />} />
                  <Route path="/company" element={<Company />} />
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
