'use client';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DailyCheckIn from '@/components/daily-check-in';
import { useProfile } from '@/context/profile-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AuthGuard from '@/components/auth-guard';

function MindQuestPageContent() {
  const { profileData } = useProfile();
  
  if (!profileData.age) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="flex items-center justify-between p-4 border-b shadow-sm">
          <div className="flex items-center">
            <Button asChild variant="ghost" size="icon" className="mr-2">
              <Link href="/games">
                <ArrowLeft />
              </Link>
            </Button>
            <ShieldCheck className="w-8 h-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
              MindQuest
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Please set your profile first
              </CardTitle>
              <CardDescription>
                We need your profile information to start your MindQuest journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link href="/profile">Go to Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/games">
              <ArrowLeft />
            </Link>
          </Button>
          <ShieldCheck className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            MindQuest
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <DailyCheckIn />
        </div>
      </main>
    </div>
  );
}


export default function MindQuestPage() {
  return (
    <AuthGuard>
      <MindQuestPageContent />
    </AuthGuard>
  )
}
