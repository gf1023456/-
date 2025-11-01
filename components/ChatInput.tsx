
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { PaperclipIcon, SendIcon, XCircleIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string, image: { data: string; mimeType: string } | null) => void;
  isLoading: boolean;
  placeholder: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, placeholder }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ file: File, preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve({ data: base64Data, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSend = async () => {
    if (isLoading || (!text.trim() && !image)) return;

    let imagePayload: { data: string; mimeType: string } | null = null;
    if (image) {
      imagePayload = await fileToBase64(image.file);
    }

    onSendMessage(text, imagePayload);
    setText('');
    setImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 flex flex-col gap-2 shadow-lg">
      {image && (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
          <img src={image.preview} alt="Image preview" className="w-full h-full object-cover" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/75 transition-colors"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-full shrink-0"
          disabled={isLoading}
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none focus:outline-none placeholder-gray-500 text-gray-200 px-2 py-2 max-h-40"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !image)}
          className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors shrink-0"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
