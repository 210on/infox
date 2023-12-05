import { Message } from "../states/messageAtom";

export function exceptionMessage(): Message {
  return {
    text: "Unexpected error occurred!",
    open: true,
    severity: "error",
  };
}

export function successMessage(text: string): Message {
  return {
    text: text,
    open: true,
    severity: "success",
  };
}
