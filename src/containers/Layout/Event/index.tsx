import { useNavigate } from 'react-router-dom'
import React, { useState } from "react";
import { BtnEventCreate } from "../../ListEvent/EventCreate/components/btnEventCreate";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function EventLayout() {
  const navigate = useNavigate()
  const { connected } = useWallet()
  const { setVisible} = useWalletModal()

  const handleOpen = () => {
    if (!connected) {
      setVisible(true)
    } else {
      navigate('/company')
    }
  }

  return (
    <div className="event">
      <BtnEventCreate onClick={handleOpen} />
    </div>
  )
}

export default EventLayout
