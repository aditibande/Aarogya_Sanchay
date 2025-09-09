import type { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User, BrainCircuit } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

function SimpleMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, index) => {
        const parts = line.split(/(\*.*?\*)/g);
        return (
          <p key={index} className="mb-2 last:mb-0">
            {parts.map((part, i) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                return <strong key={i}>{part.slice(1, -1)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </>
  );
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-4 md:p-6">
      <div className="flex flex-col gap-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-muted-foreground mt-8 p-4">
            <BrainCircuit className="mx-auto h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-semibold font-headline text-foreground">Welcome to Aarogya Sanchay</h2>
            <p className="mt-2">I am your AI health companion. Ask me any health-related questions.</p>
            <div className="mt-6 p-4 bg-card border rounded-lg text-sm text-muted-foreground" role="alert">
              <p><span className="font-bold text-foreground">Disclaimer:</span> This chatbot is not a substitute for professional medical advice. Consult with a qualified healthcare provider for any health concerns.</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-4 animate-in fade-in-0 zoom-in-95',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.sender === 'ai' && (
              <Avatar className="h-9 w-9 border border-primary/50">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-md lg:max-w-xl rounded-lg px-4 py-3 text-sm shadow-sm',
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              )}
            >
              <SimpleMarkdown text={message.text} />
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 justify-start animate-in fade-in-0">
            <Avatar className="h-9 w-9 border border-primary/50">
              <AvatarFallback className="bg-primary/20 text-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-md rounded-lg px-4 py-3 text-sm bg-card border flex items-center gap-2 shadow-sm">
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0s]"></span>
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.15s]"></span>
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
