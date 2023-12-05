import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  doc,
} from "firebase/firestore";
import { LoginUser } from "../states/userAtom";
import { database } from "../infrastructure/firebase";
import { Memo } from "./memoType";

// 一覧画面で表示するメモを取得する
export async function searchMemo(loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      const ref = collection(database, "users", loginUser.userId, "memos");
      const results = await getDocs(query(ref, orderBy("updatedAt", "desc")));
      const memos = results.docs.map((doc): Memo => {
        return {
          id: doc.id,
          ...doc.data(),
        } as Memo;
      });
      return memos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}

// 更新画面で表示するメモを取得する
export async function searchMemoById(id: string, loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      const ref = doc(database, "users", loginUser.userId, "memos", id);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        return docSnap.data() as Memo;
      } else {
        console.error("No such document!");
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
