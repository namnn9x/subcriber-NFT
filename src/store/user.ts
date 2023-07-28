import { create } from "zustand";
import produce from "immer";
import { IEvent } from "../services/event";
import { Timestamp } from "firebase/firestore";

export interface IUser {
 uid?: string
 fullname: string
 email: string
 photoURL: string
 address: string
 dateOfBirth: Timestamp | null
 createdAt?: Timestamp | null
}

export interface IUserStore {
  user: IUser;
  setUser: (user: IUser) => void;
  resetUser: () => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: {
   uid: '',
   fullname: '',
   email: '',
   photoURL: '',
   address: '',
   dateOfBirth: null,
   createdAt: null,
  },

  setUser: (data: IUser) =>
    set(
      produce((state: IUserStore) => {
        state.user = data;
      }),
    ),

  resetUser: () =>
    set(
      produce((state: IUserStore) => {
        state.user = {
          uid: "",
          fullname: "",
          email: "",
          photoURL: "",
          address: "",
          dateOfBirth: null,
          createdAt: null,
        };
      })
    ),

}));
