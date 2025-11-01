
import React from 'react';
import { Message } from '../types';
import { UserIcon, HealthExpertIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-1">
            <HealthExpertIcon className="w-5 h-5 text-teal-600" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-lg md:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-teal-500 text-white rounded-br-lg'
              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-lg'
          }`}
        >
          <div className="flex flex-col gap-3">
             {message.parts.map((part, index) => {
                if ('inlineData' in part) {
                    return (
                        <div key={index} className="rounded-lg overflow-hidden border border-slate-200">
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
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
          <UserIcon className="w-5 h-5 text-slate-500" />
        </div>
      )}
    </div>
  );
};