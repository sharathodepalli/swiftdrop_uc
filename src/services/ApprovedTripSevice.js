import { 
    collection, 
    query, 
    where, 
    getDocs, 
    getDoc, 
    doc, 
    addDoc, 
    updateDoc, 
    onSnapshot, 
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  // Get approved chats for a specific user
  export const getUserApprovedChats = (userId, callback) => {
    if (!userId) return null;
    
    const q = query(
      collection(db, "approved_trips"),
      where("userId", "==", userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      callback(chats);
    });
  };
  
  // Get approved chats for a specific traveler
  export const getTravelerApprovedChats = (travelerId, callback) => {
    if (!travelerId) return null;
    
    const q = query(
      collection(db, "approved_trips"),
      where("travelerId", "==", travelerId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      callback(chats);
    });
  };
  
  // Get a single approved chat by ID
  export const getApprovedChatById = async (chatId) => {
    if (!chatId) return null;
    
    const docRef = doc(db, "approved_chats", chatId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  };
  
  // Add a new message to the chat
  export const addMessageToChat = async (chatId, senderId, message) => {
    if (!chatId || !senderId || !message) {
      throw new Error("Missing required parameters");
    }
    
    // Add message to messages subcollection
    const messagesRef = collection(db, "approved_trips", chatId, "messages");
    const messageData = {
      senderId,
      content: message,
      timestamp: serverTimestamp(),
      read: false
    };
    
    const messageDoc = await addDoc(messagesRef, messageData);
    
    // Update last message in the chat document
    const chatRef = doc(db, "approved_trips", chatId);
    await updateDoc(chatRef, {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: senderId
    });
    
    return messageDoc.id;
  };
  
  // Get all messages for a specific chat
  export const getChatMessages = (chatId, callback) => {
    if (!chatId) return null;
    
    const messagesRef = collection(db, "approved_trips", chatId, "messages");
    
    return onSnapshot(messagesRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      // Sort messages by timestamp
      messages.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.seconds - b.timestamp.seconds;
      });
      callback(messages);
    });
  };
  
  // Update chat status
  export const updateChatStatus = async (chatId, status) => {
    if (!chatId || !status) {
      throw new Error("Missing required parameters");
    }
    
    const chatRef = doc(db, "approved_trips", chatId);
    await updateDoc(chatRef, {
      status,
      updatedAt: serverTimestamp()
    });
  };
  
  // Mark messages as read
  export const markMessagesAsRead = async (chatId, userId) => {
    if (!chatId || !userId) return;
    
    const messagesRef = collection(db, "approved_trips", chatId, "messages");
    const q = query(messagesRef, where("read", "==", false), where("senderId", "!=", userId));
    
    const unreadMessages = await getDocs(q);
    
    const batch = db.batch();
    unreadMessages.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  };