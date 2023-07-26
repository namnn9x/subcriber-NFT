import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState } from "react"
require('@solana/wallet-adapter-react-ui/styles.css');

export const Wallet = () => {
  const [loading, setLoading] = useState(false)
  const { connected, publicKey } = useWallet()

  return (
      <WalletMultiButton/>
  )
}