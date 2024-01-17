import { User, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../infrastructure/firebase";

export async function signInWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (e) {
    console.log(e);
  }
}

export async function signOutWithGoogle() {
  try {
    await auth.signOut();
  } catch (e) {
    console.log(e);
  }
}

export function setUserToLocalStorage(user?: User) {
  // リロード対策のため、LocalStorageにUIDを永続化しておく
  if (user?.uid) {
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("userName", user.displayName || "");
    localStorage.setItem("apiKey", user.apiKey || "");
  }
}

export function clearUserInLocalStorage() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("apiKey");
}
