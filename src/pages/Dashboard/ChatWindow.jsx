// import React, { useState, useEffect, useRef } from "react";
// import { getUserProfile } from "../../services/userService"; // Fetch user details

// function ChatWindow({ senderId, deliveryTitle, closeChat }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [senderName, setSenderName] = useState("Loading...");
//   const textareaRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchSenderName = async () => {
//       try {
//         const userProfile = await getUserProfile(senderId);
//         setSenderName(userProfile?.fullName || "Unknown Sender");
//       } catch (error) {
//         console.error("Error fetching sender name:", error);
//         setSenderName("Unknown Sender");
//       }
//     };

//     if (senderId) fetchSenderName();
//   }, [senderId]);

//   useEffect(() => {
//     setMessage(`Hey ${senderName}, I’m interested in the delivery "${deliveryTitle}". Let’s discuss!`);
//   }, [senderName, deliveryTitle]);

//   const sendMessage = () => {
//     if (message.trim() === "") return;
//     setMessages([...messages, { text: message, sender: "You" }]);
//     setMessage("");

//     // Scroll to the latest message
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   // Auto-expand textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "40px";
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
//     }
//   }, [message]);

//   return (
//     <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-300">
//       {/* Chat Header */}
//       <div className="p-3 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
//         <span className="font-semibold">Chat with {senderName}</span>
//         <button onClick={closeChat} className="text-white text-xl hover:opacity-80 transition">✖</button>
//       </div>

//       {/* Chat Body */}
//       <div className="p-4 h-64 overflow-y-auto text-sm text-gray-800">
//         {messages.length === 0 ? (
//           <p className="text-gray-500">Start a conversation with {senderName} about "{deliveryTitle}".</p>
//         ) : (
//           messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`mb-2 p-2 rounded-lg ${
//                 msg.sender === "You"
//                   ? "bg-blue-100 text-blue-700 self-end"
//                   : "bg-gray-200 text-gray-800 self-start"
//               }`}
//             >
//               <span className="font-semibold">{msg.sender}:</span> {msg.text}
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Chat Input */}
//       <div className="p-2 border-t border-gray-200 flex items-center">
//         <textarea
//           ref={textareaRef}
//           rows="1"
//           className="flex-1 p-2 text-sm border rounded-md outline-none resize-none overflow-hidden"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-md hover:bg-blue-600 transition">
//           ➤
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;


import React, { useState, useEffect, useRef } from "react";
import { getOrCreateChat, sendMessage, listenForMessages } from "../../services/chatService";
import { getUserProfile } from "../../services/userService";

function ChatWindow({ senderId, travelerId, deliveryTitle, closeChat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [receiverName, setReceiverName] = useState("Loading...");
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        const userProfile = await getUserProfile(travelerId);
        setReceiverName(userProfile?.fullName || "Unknown User");
      } catch (error) {
        console.error("❌ Error fetching receiver name:", error);
      }
    };

    const initializeChat = async () => {
      const chatKey = await getOrCreateChat(senderId, travelerId);
      setChatId(chatKey);
      listenForMessages(chatKey, setMessages);
    };

    if (travelerId) {
      fetchReceiverName();
      initializeChat();
    }
  }, [senderId, travelerId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    await sendMessage(chatId, senderId, message);
    setMessage("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-300">
      {/* Chat Header */}
      <div className="p-3 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
        <span className="font-semibold">Chat with {receiverName}</span>
        <button onClick={closeChat} className="text-white text-xl hover:opacity-80 transition">✖</button>
      </div>

      {/* Chat Messages */}
      <div className="p-4 h-64 overflow-y-auto text-sm text-gray-800">
        {messages.length === 0 ? (
          <p className="text-gray-500">Start a conversation with {receiverName} about "{deliveryTitle}".</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.senderId === senderId
                  ? "bg-blue-100 text-blue-700 self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              <span className="font-semibold">{msg.senderId === senderId ? "You" : receiverName}:</span> {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-2 border-t border-gray-200 flex items-center">
        <textarea
          ref={textareaRef}
          rows="1"
          className="flex-1 p-2 text-sm border rounded-md outline-none resize-none overflow-hidden"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-md hover:bg-blue-600 transition">
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
