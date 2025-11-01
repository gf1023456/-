
import React from 'react';
import { Message } from '../types';
import { UserIcon, GeminiIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0 mt-1">
            <GeminiIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-lg md:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-blue-600 rounded-br-none'
              : 'bg-gray-700 rounded-bl-none'
          }`}
        >
          <div className="flex flex-col gap-3">
             {message.parts.map((part, index) => {
                if ('inlineData' in part) {
                    return (
                        <div key={index} className="rounded-lg overflow-hidden border border-gray-600">
                             <img 
                                src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} 
                                alt="User upload" 
                                className="max-w-xs max-h-64 object-contain"
                            />
                        </div>
                    )
                }
                if ('text' in part) {
                     return (
                        <p key={index} className={`whitespace-pre-wrap ${isLoading ? 'animate-pulse' : ''}`}>
                            {part.text}
                        </p>
                     )
                }
                return null;
             })}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0 mt-1">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};
