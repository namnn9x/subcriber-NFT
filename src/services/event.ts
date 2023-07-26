import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../libs/firebase"

export interface IEvent {
  uid: string
  id?: string
  title: string
  description: string,
  coverImage: string,
  ticketLimit: number,
  nftReward: string,
  createdBy?: string,
  eventTime?: Timestamp | null,
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

const COLLECTION_NAME = 'events'

export const addEvent = async (event: IEvent) => {
  const { uid, title, coverImage, description, eventTime, ticketLimit, createdBy } = event

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    uid,
    title,
    description,
    coverImage,
    eventTime,
    ticketLimit,
    createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })

  const newDoc = await getDoc(doc(db, COLLECTION_NAME, docRef.id));
  return newDoc.data()

}

export const updateEvent = async ({
  id, event
}: {
  id: string,
  event: Partial<Event>
}) => {
  updateDoc(doc(db, "events", id), {
    // content,
    event,
    // title,
    updatedAt: Timestamp.now(),
  })
}

export const delEvent = async (id: string) => {
  try {
    await deleteDoc(doc(db, "events", id))
  } catch (error) {
    console.log(error)
  }
}

export const getEventByUid = async (uid: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("uid", "==", uid),
      orderBy("updatedAt", "desc")
    )
    const pads = await getDocs(q)

    if (pads.empty) {
      return []
    }

    const eventList: IEvent[] = []
    pads.forEach((pad) => {
      const padData = pad.data() as IEvent
      eventList.push({
        uid: padData.uid,
        id: pad.id,
        title: padData.title,
        description: padData.description,
        createdAt: padData.createdAt,
        updatedAt: padData.updatedAt,
        coverImage: padData.coverImage,
        nftReward: padData.nftReward,
        eventTime: padData.eventTime,
        ticketLimit: padData.ticketLimit,
      })
    })

    return eventList
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getAllEvent = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME))

    const pads = await getDocs(q)

    if (pads.empty) {
      return []
    }

    const eventList: IEvent[] = []
    pads.forEach((pad) => {
      const padData = pad.data() as IEvent
      eventList.push({
        uid: padData.uid,
        id: pad.id,
        title: padData.title,
        description: padData.description,
        createdBy: padData.createdBy,
        createdAt: padData.createdAt,
        updatedAt: padData.updatedAt,
        coverImage: padData.coverImage,
        nftReward: padData.nftReward,
        eventTime: padData.eventTime,
        ticketLimit: padData.ticketLimit,
      })
    })

    return eventList
  } catch (error) {
    console.log(error)
    return null
  }
}
