'use client';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MemoryGridChallenge from '@/components/memory-grid-challenge';

export default function MemoryGridPage() {
  return (
    <div className="flex flex-col h-screen from-background to-muted/50 bg-gradient-to-br text-foreground">
      <header className="flex items-center justify-between p-4 border-b shadow-sm bg-background/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/games">
              <ArrowLeft />
            </Link>
          </Button>
          <BrainCircuit className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Memory Grid
          </h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
        <MemoryGridChallenge />
      </main>
    </div>
  );
}
