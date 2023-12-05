import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";
import { LoginUser } from "../states/userAtom";

export async function deleteMemo(memoId: string, loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      // 削除
      const ref = doc(database, "users", loginUser.userId, "memos", memoId);
      await deleteDoc(ref);
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
