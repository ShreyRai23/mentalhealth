'use client';

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, User, HeartPulse } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getAiReply } from '@/app/actions';
import type { AIHealthConsultationOutput } from '@/ai/flows/ai-health-consultation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'loading';
  content: string | AIHealthConsultationOutput;
}

const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
  </div>
);

const AiMessageContent = ({ content }: { content: AIHealthConsultationOutput }) => {
  if (content.recommendations && content.recommendations.length > 0) {
    return (
      <Table className="table-auto w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Condition</TableHead>
            <TableHead className="w-1/3">Description (Key Symptoms)</TableHead>
            <TableHead className="w-1/3">Advice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.recommendations.map((rec, index) => (
            <TableRow key={index} className="border-border">
              <TableCell className="font-medium">{rec.condition}</TableCell>
              <TableCell>{rec.description}</TableCell>
              <TableCell>{rec.advice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (content.response) {
    return <p className="whitespace-pre-wrap text-sm">{content.response}</p>;
  }

  return <p className="text-sm text-muted-foreground">The AI assistant did not provide a valid response.</p>;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'loading',
      content: '',
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const result = await getAiReply(userMessage.content as string);
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: result,
      };
      setMessages(prev =>
        prev.map(msg => (msg.role === 'loading' ? aiMessage : msg))
      );
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Failed to get a response from the AI. Please try again.',
      });
      setMessages(prev => prev.filter(msg => msg.role !== 'loading'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role !== 'user' && (
                <Avatar className="w-9 h-9 border border-border">
                  <AvatarFallback className="bg-transparent text-primary">
                    <HeartPulse className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-5 rounded-2xl text-foreground w-full shadow-lg transition-all',
                  'border-none',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm max-w-md ml-auto'
                    : 'bg-card rounded-bl-sm max-w-4xl mr-auto',
                  message.role === 'loading' && 'p-5 max-w-md'
                )}
              >
                {message.role === 'loading' ? (
                  <LoadingDots />
                ) : message.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm">{message.content as string}</p>
                ) : (
                  <div className="space-y-4">
                    <AiMessageContent content={message.content as AIHealthConsultationOutput} />
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-9 h-9 border">
                  <AvatarFallback className="bg-secondary">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-20 animate-fade-in mt-20">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <HeartPulse className="w-12 h-12 text-primary" />
              </div>
              <p className="text-2xl font-bold font-headline text-foreground mb-2">Welcome to AI Doc</p>
              <p className="text-base">
                Describe your symptoms to get started.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-transparent pb-8">
        <div className="p-2 rounded-full bg-card shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-none mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex items-end gap-2 px-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent);
                }
              }}
              placeholder="Describe your symptoms..."
              className="flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base min-h-[44px] max-h-40 py-3 overflow-y-auto"
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-md mb-1"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-primary-foreground ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
