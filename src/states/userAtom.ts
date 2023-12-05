import { atom } from "recoil";

export type LoginUser = {
  userId: string | null;
  userName: string | null;
};

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: localStorage.getItem("userId") || null,
    userName: localStorage.getItem("userName") || null,
  } as LoginUser,
});
