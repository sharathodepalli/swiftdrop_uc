import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserProfile = async (userId) => {
  if (!userId) return null;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
