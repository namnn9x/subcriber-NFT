import { create } from "zustand";
import produce from "immer";
import { IEvent } from "../services/event";
import { Timestamp } from "firebase/firestore";
import { IUser } from "../services/users";

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
   dateOfBirth: Timestamp.now(),
   createdAt: Timestamp.now(),
   role: '',
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
          role: '',
          dateOfBirth: Timestamp.now(),
          createdAt: Timestamp.now(),
        };
      })
    ),

}));
