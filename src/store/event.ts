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

export const useEventStore = create<IEventStore>((set) => ({
  events: [],

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
