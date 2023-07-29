import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../libs/firebase"

export interface IEvent {
  uid: string
  id?: string
  title: string
  description: string,
  coverImage: string,
  ticketLimit: number,
  subscriberId: string[],
  nftReward: string[],
  createdBy?: string,
  eventTime?: Timestamp | null,
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

const COLLECTION_NAME = 'events'

export const addEvent = async (event: IEvent) => {
  const { uid, title, coverImage, description, eventTime, ticketLimit, createdBy, nftReward } = event
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    nftReward,
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

export const updateEvent = async ({ newEvent }: {
  newEvent: IEvent
}) => {
  const idx  = newEvent.id;
  if (!idx) {
    console.log('Khong có id su kien') 
    return
  }
  updateDoc(doc(db, "events", idx), {
    ...newEvent,
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

export const getEventById = async (id: string) => {
  try {
    const eventDocRef = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDocRef);

    if (eventSnapshot.exists()) {
      const eventData = eventSnapshot.data();
      return {
        id,
        ...eventData,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

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
        subscriberId: padData.subscriberId,
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
        subscriberId: padData.subscriberId,
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
