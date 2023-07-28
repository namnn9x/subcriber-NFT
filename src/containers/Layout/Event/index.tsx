import { EventCreate } from "../../ListEvent/EventCreate";
import { BtnEventCreate } from "../../ListEvent/EventCreate/components/btnEventCreate";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function EventLayout() {
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

export default EventLayout
