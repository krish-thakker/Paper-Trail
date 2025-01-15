import React, { useState } from 'react';

const AIChatbot = ({ onMessage }) => {


  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I assist you today?', sender: 'bot' },
  ]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);

    // Send the user's question to the backend AI
    const response = await onMessage(input);

    // Add the AI's response to the chat
    setMessages([...newMessages, { text: response, sender: 'bot' }]);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === 'bot' ? 'left' : 'right',
              margin: '5px 0',
              padding: '10px',
              backgroundColor: message.sender === 'bot' ? '#f0f0f0' : '#d1e7dd',
              borderRadius: '10px',
              maxWidth: '70%',
              display: 'inline-block',
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default AIChatbot;
