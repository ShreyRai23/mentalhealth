'use client';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PulseRunner from '@/components/pulse-runner';

export default function PulseRunnerPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/games">
              <ArrowLeft />
            </Link>
          </Button>
          <HeartPulse className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            PulseRunner
          </h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
        <div className="text-center mb-4">
          <p className="text-muted-foreground">
            Space / Click / Tap = flap · R = restart
          </p>
        </div>
        <PulseRunner />
      </main>
    </div>
  );
}
