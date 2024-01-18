import { atom } from "recoil";

export type LoginUser = {
  userId: string | null;
  userName: string | null;
  apiKey: string | null;
};

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: localStorage.getItem("userId") || null,
    userName: localStorage.getItem("userName") || null,
    apiKey: localStorage.getItem("apiKey") || null,
  } as LoginUser,
});
