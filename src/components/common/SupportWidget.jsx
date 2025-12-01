import { useState } from 'react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! How can we help you today?',
      sender: 'support',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: 'Thank you for your message! Our team will get back to you soon. For immediate assistance, please contact us at muhammadsobrimaulana31@gmail.com',
        sender: 'support',
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const quickActions = [
    { icon: '📧', text: 'Email', action: 'mailto:muhammadsobrimaulana31@gmail.com' },
    { icon: '💬', text: 'Telegram', action: 'https://t.me/winlin_exploit' },
    { icon: '📱', text: 'WhatsApp', action: 'https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl' }
  ];

  return (
    <>
      <button
        className="support-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open support chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="support-widget">
          <div className="support-widget-header">
            <h4>Support Chat</h4>
            <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
          </div>

          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.action}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn"
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </a>
            ))}
          </div>

          <div className="support-widget-messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'message-user' : 'message-support'}`}
              >
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.time}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="support-widget-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-btn">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
