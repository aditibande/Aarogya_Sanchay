'use client';

import { useState } from 'react';
import type { Message } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { getHealthInformation } from '@/ai/flows/health-information-tool';
import { ChatLayout } from '@/components/chat-layout';

export default function Home() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chatHistory', []);
  const [language, setLanguage] = useState<'english' | 'malayalam' | 'hindi'>('english');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await getHealthInformation({ query: text, language });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: `${response.answer}\n\n*${response.disclaimer}*`,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching health information:', error);
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        text: "I'm sorry, but I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout
      messages={messages}
      language={language}
      onLanguageChange={setLanguage}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
    />
  );
}
