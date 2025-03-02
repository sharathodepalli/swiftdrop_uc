import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getUserApprovedChats, getChatMessages, markMessagesAsRead } from "../../services/approvedChatService";
import { formatDistanceToNow } from "date-fns";

function ApprovedChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch approved chats
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = getUserApprovedChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
        setLoading(false);
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    let unsubscribe = null;
    
    if (selectedChat) {
      unsubscribe = getChatMessages(selectedChat.id, (fetchedMessages) => {
        setMessages(fetchedMessages);
        // Mark messages as read
        markMessagesAsRead(selectedChat.id, user.uid);
      });
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChat, user]);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      await addMessageToChat(selectedChat.id, user.uid, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Approved Deliveries</h2>
        </div>
        
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No approved deliveries found
          </div>
        ) : (
          <div>
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{chat.itemDetails?.title || "Delivery"}</h3>
                    <p className="text-sm text-gray-500 mt-1">{chat.pickup?.address}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    chat.status === "Completed" ? "bg-green-100 text-green-800" : 
                    chat.status === "Approved" ? "bg-blue-100 text-blue-800" : 
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {chat.status}
                  </span>
                </div>
                {chat.lastMessage && (
                  <div className="mt-2">
                    <p className="text-sm truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(chat.lastMessageTime)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedChat.itemDetails?.title || "Delivery"}</h3>
                  <p className="text-sm text-gray-500">Status: {selectedChat.status}</p>
                </div>
                <div>
                  <button className="text-blue-500 hover:text-blue-700">
                    View Delivery Details
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`max-w-3/4 rounded-lg p-3 ${
                        message.senderId === user.uid 
                          ? "bg-blue-500 text-white ml-auto" 
                          : "bg-white border ml-0"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user.uid ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p>Select a delivery to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovedChats;