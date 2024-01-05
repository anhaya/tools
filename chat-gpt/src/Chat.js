import React, { useState } from 'react';
import './Chat.css';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true
});

let messageRequest = []

async function sendMessageOpenAI() {
  const completion = await openai.chat.completions.create({
    messages: messageRequest,
    model: "gpt-4",
  });

  return completion.choices[0].message.content;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  const sendMessage = async () => {
    if (message.trim() === '' || loading) return;

    try {
      setLoading(true); // Set loading to true before API call

      messageRequest.push({ role: "user", content: message });
      console.log(messageRequest)
  
      // Call your API here with the message
      const responseOpenAI = await sendMessageOpenAI();
      messageRequest.push({ role: "system", content: responseOpenAI });

      // Update the chat with the new message
      setChat((prevChat) => [
        ...prevChat,
        { text: message, sender: 'user' },
        { text: responseOpenAI, sender: 'system' }, // Placeholder for loading response
      ]);

      // Clear the message input after successful API call
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false); // Set loading back to false after API call completion
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMessage = (msg, index) => {
    if (msg.text.includes('```')) {
      return (
        <pre key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </pre>
      );
    }

    return (
      <div key={index} className={`message ${msg.sender}`}>
        {msg.text}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat">
        {chat.map((msg, index) => renderMessage(msg, index))}
        {loading && <div className="message bot">Loading...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;