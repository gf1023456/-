
import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { Message, MessagePart, Role } from './types';
import { startChat, sendMessageToChat } from './services/geminiService';
import { GeminiIcon } from './components/Icons';
import { getInitialLang, getTranslator } from './utils/i18n';

const getInitialMessages = (): Message[] => {
  const lang = getInitialLang();
  const t = getTranslator(lang);
  try {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
        return parsedMessages;
      }
    }
  } catch (error) {
    console.error('Could not load chat history from localStorage', error);
    localStorage.removeItem('chatHistory'); // Clear corrupted data
  }
  // Return default message if localStorage is empty or corrupted
  return [
    {
      role: 'model',
      parts: [{ text: t('initialMessage') }],
    },
  ];
};


const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'zh'>(getInitialLang());
  const t = getTranslator(lang);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // The chat history for the Gemini API should ideally start with a 'user' role.
    // If our stored history starts with a 'model' role (like the initial welcome message),
    // we slice it off for the chat initialization. It remains in the UI state.
    const historyForChat = messages[0]?.role === 'model' ? messages.slice(1) : messages;
    startChat(historyForChat);
  }, []); // Run only once on initial render

  const handleToggleLang = () => {
    setLang(prevLang => (prevLang === 'en' ? 'zh' : 'en'));
  };

  const handleSendMessage = async (text: string, image: { data: string; mimeType: string } | null) => {
    if (isLoading) return;
    if (!text.trim() && !image) return;

    setIsLoading(true);
    setError(null);

    const userParts: MessagePart[] = [];
    if (image) {
        userParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
    }
    
    let promptText = text.trim();
    if(image && !promptText){
        promptText = t('imageAnalysisPrompt');
    }
    if(promptText){
        userParts.push({ text: promptText });
    }

    const userMessage: Message = { role: 'user', parts: userParts };
    setMessages(prev => [...prev, userMessage]);

    try {
        const responseText = await sendMessageToChat(userMessage.parts);
        const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
        setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(t('errorMessage', { errorMessage }));
        const modelErrorMessage: Message = { role: 'model', parts: [{ text: t('chatErrorMessage', { errorMessage }) }] };
        setMessages(prev => [...prev, modelErrorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <header className="p-4 border-b border-gray-700 shadow-md bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <GeminiIcon className="w-8 h-8"/>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {t('title')}
              </h1>
           </div>
           <button
             onClick={handleToggleLang}
             className="text-sm font-semibold text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
           >
             {t('langToggle')}
           </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <ChatMessage message={{ role: 'model', parts: [{text: t('thinking')}] }} isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          {error && <div className="text-red-400 text-center mb-2">{error}</div>}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            placeholder={t('inputPlaceholder')}
            />
        </div>
      </footer>
    </div>
  );
};

export default App;
