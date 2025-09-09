import type { Dispatch, SetStateAction } from 'react';
import type { Message } from '@/lib/types';
import {
  HeartPulse,
  Languages,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface ChatLayoutProps {
  messages: Message[];
  language: 'english' | 'malayalam' | 'hindi';
  onLanguageChange: Dispatch<SetStateAction<'english' | 'malayalam' | 'hindi'>>;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function ChatLayout({
  messages,
  language,
  onLanguageChange,
  onSendMessage,
  isLoading,
}: ChatLayoutProps) {
  
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},15z`, '_blank');
      }, () => {
        window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
      });
    } else {
      window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
    }
  };

  return (
    <main className="flex h-full flex-col items-center p-4 md:p-6 lg:p-8">
      <div className="flex flex-col w-full max-w-4xl h-full shadow-2xl rounded-xl overflow-hidden bg-card">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Aarogya Sanchay</h1>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleLocate} aria-label="Find Nearby Clinics">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Find Nearby Clinics/Hospitals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select value={language} onValueChange={(value) => onLanguageChange(value as 'english' | 'malayalam' | 'hindi')}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectTrigger className="w-auto gap-2" aria-label="Select language">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select Language</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="malayalam">മലയാളം</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <Separator />
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
