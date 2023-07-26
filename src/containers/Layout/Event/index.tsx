import { EventCreate } from "./EventCreate";
import { BtnEventCreate } from "./EventCreate/components/btnEventCreate";
import { useState } from "react";
import { ListEvent } from "./ListEvent";

function Event() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="event">
      {/* <ListEvent/> */}
      <EventCreate isOpen={isOpen} setIsOpen={setIsOpen} />
      <BtnEventCreate onClick={() => setIsOpen(true)} />
    </div>
  )
}

export default Event
