import { EventCreate } from './EventCreate'
import { BtnEventCreate } from './EventCreate/components/btnEventCreate'
import { useState } from 'react'

function Event() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="event">
      <EventCreate isOpen={isOpen} setIsOpen={setIsOpen} />
      <BtnEventCreate onClick={() => setIsOpen(true)} />
    </div>
  )
}

export default Event
