import { updatePassword } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../libs/firebase"
import { ROLE } from "../containers/Signup"

export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IUser {
  uid?: string
  fullname: string
  email: string
  photoURL: string
  address: string
  searchID?: string
  dateOfBirth: Timestamp
  role: ROLE | string
  createdAt?: Timestamp
  status?: EUserStatus
}

export const addUser = async (user: IUser) => {

  const { uid, address, email, dateOfBirth, fullname, photoURL, role } = user
  await setDoc(doc(db, "users", uid || ""), {
    uid,
    address,
    email,
    searchID: user.searchID,
    createdAt: Timestamp.now(),
    dateOfBirth: dateOfBirth,
    fullname,
    photoURL,
    role,
    status: EUserStatus.ACTIVE,
  }).catch((err) => {
    console.log(`Create use ${err}`)
  })

  return 1
}

export const updateUserById = async (uid: string, user: Partial<IUser>) => {
  try {
    const { fullname, photoURL, dateOfBirth, address } = user
    await updateDoc(doc(db, 'users', uid), {
      fullname,
      photoURL,
      dateOfBirth,
      address,
    })

    return 1
  } catch (error) {
    console.log(error)
  }
  // const { uid, address, email, dateOfBirth, fullname, photoURL } = user;

  // await setDoc(doc(db, "users", uid || ""), {
  //   address,
  //   email,
  //   createdAt: Timestamp.now(),
  //   dateOfBirth: dateOfBirth,
  //   fullname,
  //   photoURL,
  //   status: EUserStatus.ACTIVE,
  // });

  // return 1;
}

export const changeUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser

    if (!user) return 0
    console.log(user)
    await updatePassword(user, newPassword)

    return 1
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const getUser = async (uid: string): Promise<IUser | null> => {
  const user = await getDoc(doc(db, 'users', uid))

  if (user.exists()) {
    return user.data() as IUser
  } else {
    return null
  }
}

export const getAllArtists = async (): Promise<IUser[] | null> => {
  try {
    const usersRef = collection(db, 'users');

    const q = query(usersRef, where('role', '==', 'Artist'));

    const querySnapshot = await getDocs(q);

    const artists: IUser[] = querySnapshot.docs.map((doc) => doc.data() as IUser);

    return artists;
  } catch (error) {
    console.error('Error getting artists:', error);
    return null;
  }
};

