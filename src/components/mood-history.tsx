
'use client';
import { useMood } from '@/context/mood-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from './ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

export default function MoodHistory() {
  const { moods } = useMood();

  if (moods.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Mood History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-40">
          <div className="space-y-4 pr-4">
            {moods.map((mood, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-3xl">{mood.emoji}</p>
                  <div>
                    <p className="font-medium text-gray-800">{mood.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(mood.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
