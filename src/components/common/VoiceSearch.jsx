import { useState, useEffect } from 'react';

export default function VoiceSearch({ onSearch }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onSearch(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button 
      className={`voice-search-btn ${isListening ? 'listening' : ''}`}
      onClick={startListening}
      disabled={isListening}
      title="Voice search"
    >
      {isListening ? (
        <>
          <span className="pulse-ring"></span>
          <span className="voice-icon">🎤</span>
        </>
      ) : (
        <span className="voice-icon">🎤</span>
      )}
    </button>
  );
}
