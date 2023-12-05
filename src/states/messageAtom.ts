import { atom } from "recoil";

export type Message = {
  text: string;
  open: boolean;
  severity?: "success" | "info" | "warning" | "error";
};

export const messageAtom = atom({
  key: "messageAtom",
  default: {
    text: "",
    open: false,
    severity: undefined,
  } as Message,
});
