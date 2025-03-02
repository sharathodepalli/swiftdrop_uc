// import { db } from "./firebase";
// import { collection, doc, setDoc, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from "firebase/firestore"; // ✅ Import where & getDocs

// /**
//  * Get or create a chat between sender and traveler.
//  */
// export const getOrCreateChat = async (senderId, travelerId) => {
//   const chatId = [senderId, travelerId].sort().join("_"); // Unique chat ID
//   const chatRef = doc(db, "chats", chatId);

//   try {
//     const chatSnapshot = await getDoc(chatRef);
//     if (!chatSnapshot.exists()) {
//       await setDoc(chatRef, {
//         participants: [senderId, travelerId],
//         lastUpdated: serverTimestamp(),
//       });
//     }
//     return chatId;
//   } catch (error) {
//     console.error("❌ Error getting/creating chat:", error);
//     return null;
//   }
// };

// /**
//  * Send a message in the chat.
//  */
// export const sendMessage = async (chatId, senderId, text) => {
//   if (!text.trim()) return;
//   const messageRef = collection(db, "chats", chatId, "messages");

//   try {
//     await addDoc(messageRef, {
//       senderId,
//       text,
//       timestamp: serverTimestamp(),
//     });

//     await setDoc(doc(db, "chats", chatId), {
//       lastUpdated: serverTimestamp(),
//     }, { merge: true });

//   } catch (error) {
//     console.error("❌ Error sending message:", error);
//   }
// };

// /**
//  * Listen for real-time messages.
//  */
// export const listenForMessages = (chatId, callback) => {
//   const messagesRef = collection(db, "chats", chatId, "messages");
//   const q = query(messagesRef, orderBy("timestamp", "asc"));

//   return onSnapshot(q, (snapshot) => {
//     const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     callback(messages);
//   });
// };

// export const getChatMessageCount = async (senderId, travelerId) => {
//     if (!senderId || !travelerId) {
//       console.error("❌ getChatMessageCount Error: senderId or travelerId is missing", { senderId, travelerId });
//       return 0;
//     }
  
//     const chatId = [senderId, travelerId].sort().join("_");
//     const messagesRef = collection(db, "chats", chatId, "messages");
  
//     try {
//       console.log(`Fetching unread messages for chat: ${chatId}`);
  
//       const q = query(
//         messagesRef,
//         where("read", "==", false),
//         where("senderId", "!=", senderId)
//       );
  
//       const unreadMessages = await getDocs(q);
//       console.log(`Unread messages count: ${unreadMessages.size}`);
      
//       return unreadMessages.size;
//     } catch (error) {
//       console.error("❌ Error getting unread messages:", error);
//       return 0;
//     }
//   };
  

import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from "firebase/firestore"; 

// /**
//  * Get or create a chat between sender and traveler.
//  */
// export const getOrCreateChat = async (senderId, travelerId) => {
//   if (!senderId || !travelerId) {
//     console.error("❌ Error: Missing senderId or travelerId", { senderId, travelerId });
//     return null;
//   }

//   const chatId = [senderId, travelerId].sort().join("_"); // Ensures unique ID regardless of order
//   const chatRef = doc(db, "chats", chatId);

//   try {
//     const chatSnapshot = await getDoc(chatRef);
//     if (!chatSnapshot.exists()) {
//       console.log(`Creating new chat between ${senderId} and ${travelerId}`);
//       await setDoc(chatRef, {
//         participants: [senderId, travelerId],
//         lastUpdated: serverTimestamp(),
//       });
//     } else {
//       console.log(`Chat already exists: ${chatId}`);
//     }
//     return chatId;
//   } catch (error) {
//     console.error("❌ Error getting/creating chat:", error);
//     return null;
//   }
// };'



export const getOrCreateChat = async (senderId, travelerId) => {
    if (!senderId || !travelerId || senderId === travelerId) {
      console.error("❌ Invalid senderId or travelerId. They must be different.");
      return null;
    }
  
    const chatId = [senderId, travelerId].sort().join("_"); // Ensure consistent chatId
    const chatRef = doc(db, "chats", chatId);
  
    try {
      const chatSnapshot = await getDoc(chatRef);
      if (!chatSnapshot.exists()) {
        console.log(`📢 Creating new chat: ${chatId}`);
        await setDoc(chatRef, {
          participants: [senderId, travelerId],
          lastUpdated: serverTimestamp(),
        });
      } else {
        console.log(`📢 Chat already exists: ${chatId}`);
      }
      return chatId;
    } catch (error) {
      console.error("❌ Error getting/creating chat:", error);
      return null;
    }
  };
  

/**
 * Send a message in the chat.
 */
export const sendMessage = async (chatId, senderId, text) => {
    if (!text.trim()) return;
    if (!chatId || !senderId) {
      console.error("❌ Invalid chatId or senderId in sendMessage.");
      return;
    }
  
    const messageRef = collection(db, "chats", chatId, "messages");
  
    try {
      await addDoc(messageRef, {
        senderId,
        text,
        timestamp: serverTimestamp(),
      });
  
      console.log(`✅ Message sent to chat ${chatId}: ${text}`);
  
      await setDoc(doc(db, "chats", chatId), {
        lastUpdated: serverTimestamp(),
      }, { merge: true });
  
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };
  
/**
 * Listen for real-time messages.
 */
export const listenForMessages = (chatId, callback) => {
    if (!chatId) {
      console.error("❌ listenForMessages called with undefined chatId.");
      return () => {};
    }
  
    console.log(`📡 Setting up real-time listener for chat: ${chatId}`);
  
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
  
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log(`🚫 No messages found for chat ${chatId}`);
      } else {
        console.log(`📩 Received ${snapshot.docs.length} messages for chat ${chatId}`);
      }
  
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    }, (error) => {
      console.error("❌ Error fetching messages:", error);
    });
  };
  