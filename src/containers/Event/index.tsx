import { EventCreate } from "./EventCreate";
import { BtnEventCreate } from "./EventCreate/components/btnEventCreate";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function Event() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { connected } = useWallet()
  const { setVisible} = useWalletModal()

  const handleOpen = () => {
    if (!connected) {
      setVisible(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <div className="event">
      <EventCreate isOpen={isOpen} setIsOpen={setIsOpen} />
      <BtnEventCreate onClick={handleOpen} />
    </div>
  )
}

export default Event
