
'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SnakeGame from '@/components/snake-game';
import { SerpentIcon } from '@/components/icons/serpent-icon';

export default function SereneSerpentPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/games">
              <ArrowLeft />
            </Link>
          </Button>
          <SerpentIcon className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Serene Serpent
          </h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
        <div className="text-center mb-4">
          <p className="text-muted-foreground">
            Use arrow keys or on-screen buttons to guide the serpent.
          </p>
        </div>
        <SnakeGame />
      </main>
    </div>
  );
}
