import { create } from "zustand";
import produce from "immer";
import { IEvent } from "../services/event";

export interface IEventStore {
  events: IEvent[];
  addAllEvents: (data: IEvent[]) => void;
  addEvent: (data: IEvent) => void;
  updateEvent: (id: string, newData: Partial<IEvent>) => void;
  delEvent: (id: string) => void;
}

const fakeEventData: IEvent[] = [
  {
    uid: "event_1",
    id: "event_id_1",
    title: "Event 1",
    description: "This is the description for Event 1.",
    coverImage: "https://example.com/event1_cover.jpg",
    ticketLimit: 1000,
    nftReward: "NFT_Reward_1",
  },
  {
    uid: "event_2",
    id: "event_id_2",
    title: "Event 2",
    description: "This is the description for Event 2.",
    coverImage: "https://example.com/event2_cover.jpg",
    ticketLimit: 500,
    nftReward: "NFT_Reward_2",
  },
  {
    uid: "event_1",
    id: "event_id_1",
    title: "Event 1",
    description: "This is the description for Event 1.",
    coverImage: "https://example.com/event1_cover.jpg",
    ticketLimit: 1000,
    nftReward: "NFT_Reward_1",
  },
  {
    uid: "event_2",
    id: "event_id_2",
    title: "Event 2",
    description: "This is the description for Event 2.",
    coverImage: "https://example.com/event2_cover.jpg",
    ticketLimit: 500,
    nftReward: "NFT_Reward_2",
  },
  {
    uid: "event_1",
    id: "event_id_1",
    title: "Event 1",
    description: "This is the description for Event 1.",
    coverImage: "https://example.com/event1_cover.jpg",
    ticketLimit: 1000,
    nftReward: "NFT_Reward_1",
  },
  {
    uid: "event_2",
    id: "event_id_2",
    title: "Event 2",
    description: "This is the description for Event 2.",
    coverImage: "https://example.com/event2_cover.jpg",
    ticketLimit: 500,
    nftReward: "NFT_Reward_2",
  },
];

export const useEventStore = create<IEventStore>((set) => ({
  events: fakeEventData,

  addAllEvents: (data: IEvent[]) =>
    set(
      produce((state: IEventStore) => {
        state.events = data;
      }),
    ),

  addEvent: (data) =>
    set(
      produce((state: IEventStore) => {
        state.events.push(data);
      }),
    ),

  updateEvent: (id, newData) =>
    set(
      produce((state: IEventStore) => {
        state.events.forEach((event, index) => {
          if (id === event.id) {
            state.events[index] = { ...event, ...newData };
          }
        });
      }),
    ),

  delEvent: (id) =>
    set(
      produce((state: IEventStore) => {
        state.events = state.events.filter((status) => status.id !== id);
      }),
    ),
}));
