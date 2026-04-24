'use client';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import ChatInterface from '@/components/chat-interface';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';


function AiDocPageContent() {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b shadow-sm bg-card/50">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/home">
              <ArrowLeft />
            </Link>
          </Button>
          <Stethoscope className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            AI Doc
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}

export default function AiDocPage() {
  return (
    <AuthGuard>
      <AiDocPageContent />
    </AuthGuard>
  );
}
