import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";
import { LoginUser } from "../states/userAtom";
import { Memo } from "./memoType";

export async function saveMemo(memo: Memo, loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      if (!memo.id) {
        // 新規登録
        const ref = collection(database, "users", loginUser.userId, "memos");
        const _memo = { ...memo };
        delete _memo.id;
        await addDoc(ref, _memo);
      } else {
        // 更新
        const ref = doc(database, "users", loginUser.userId, "memos", memo.id);
        await setDoc(ref, memo);
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
