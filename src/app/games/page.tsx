
'use client';
import { Gamepad2, ArrowLeft, Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AuthGuard from '@/components/auth-guard';
import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';


const games = [
  {
    title: 'Blocky Blast Puzzle',
    genre: 'Puzzle',
    recommendedAge: '10+',
    link: 'https://poki.com/en/g/blocky-blast-puzzle',
    tags: ['Calm', 'Focus'],
    imageHint: 'abstract blocks',
    playtime: 5,
    recommended: true,
    newest: false,
    mostPlayed: false,
  },
  {
    title: 'Merge & Double',
    genre: 'Puzzle',
    recommendedAge: '8+',
    link: 'https://poki.com/en/g/merge-and-double',
    tags: ['Focus', 'Quick'],
    imageHint: 'number puzzle',
    playtime: 3,
    recommended: false,
    newest: true,
    mostPlayed: false,
  },
  {
    title: 'Sweet World',
    genre: 'Puzzle',
    recommendedAge: '7+',
    link: 'https://poki.com/en/g/sweet-world',
    tags: ['Calm_Casual'],
    imageHint: 'candy world',
    playtime: 5,
    recommended: false,
    newest: false,
    mostPlayed: true,
  },
  {
    title: 'Chess Multiplayer',
    genre: 'Strategy',
    recommendedAge: '7+',
    link: 'https://poki.com/en/g/chess-multiplayer',
    tags: ['Strategy', 'Focus', 'Social'],
    imageHint: 'chess board',
    playtime: 15,
    recommended: true,
    newest: false,
    mostPlayed: true,
  },
  {
    title: 'Four in a Row',
    genre: 'Strategy',
    recommendedAge: '7+',
    link: 'https://poki.com/en/g/four-in-a-row   ',
    tags: ['Strategy', 'Quick'],
    imageHint: 'classic boardgame',
    playtime: 3,
    recommended: false,
    newest: false,
    mostPlayed: false,
  },
  {
    title: 'SmashKarts',
    genre: 'Arcade',
    recommendedAge: '13+',
    link: 'https://smashkarts.io/',
    tags: ['Action', 'Competitive'],
    imageHint: 'kart racing',
    playtime: 8,
    recommended: true,
    newest: true,
    mostPlayed: true,
    safetyNote: 'May include intense action.',
  },
  {
    title: 'Mario Kart 8',
    genre: 'Racing',
    recommendedAge: '10+',
    link: 'https://mariokart8.nintendo.com/',
    tags: ['Racing', 'Joyful'],
    imageHint: 'cartoon race',
    playtime: 5,
    recommended: true,
    newest: false,
    mostPlayed: false,
  },
  {
    title: 'Call of Duty: Warzone',
    genre: 'Shooter',
    recommendedAge: '18+',
    link: 'https://www.callofduty.com/warzone',
    tags: ['Shooter', 'Competitive'],
    imageHint: 'soldier action',
    playtime: 20,
    recommended: false,
    newest: false,
    mostPlayed: true,
    safetyNote: 'May include intense action.',
  },
  {
    title: 'Snake',
    genre: 'Arcade',
    recommendedAge: '7+',
    link: 'https://www.google.com/search?q=snake+game&rlz=1C1ONGR_enIN1063IN1067&oq=snake+game&gs_lcrp=EgZjaHJvbWUqBwgAEAAYjwIyBwgAEAAYjwIyEggBEC4YQxjUAhixAxiABBiKBTINCAIQABiDARixAxiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIKCAcQABixAxiABDIHCAgQABiABDIHCAkQABiABNIBCDcyMTFqMGo5qAIGsAIB8QV6R9Rdmp82mQ&sourceid=chrome&ie=UTF-8',
    tags: ['Quick', 'Nostalgia'],
    imageHint: 'classic snake',
    playtime: 2,
    recommended: false,
    newest: false,
    mostPlayed: false,
  },
];

const GameCard = ({ game }: { game: (typeof games)[0] }) => (
  <Card className="group flex flex-col overflow-hidden bg-card transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 border-none shadow-lg relative">
    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary z-10" />
    <div className="relative h-44 w-full">
      <Image
        src={`https://picsum.photos/seed/${encodeURIComponent(game.title)}/600/400`}
        alt={game.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        data-ai-hint={game.imageHint}
      />
      <Badge className="absolute top-3 right-3 bg-foreground/80 text-background backdrop-blur-md border-none text-xs font-bold shadow-md">
        {game.recommendedAge}
      </Badge>
    </div>
    <CardHeader className="p-5 pb-3 relative">
      <CardTitle className="font-bold text-xl text-foreground font-headline leading-tight">
        {game.title}
      </CardTitle>
      <CardDescription className="text-sm text-muted-foreground font-medium">
        {game.genre}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-end">
      <div className="flex flex-wrap gap-2 mb-5">
        {game.tags.map(tag => (
          <Badge key={tag} className="text-xs font-semibold bg-secondary/10 text-secondary border-none px-2 py-0.5">
            {tag}
          </Badge>
        ))}
        {game.safetyNote && (
          <p className="text-xs text-destructive font-medium mt-1 w-full flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 animate-pulse" />
            {game.safetyNote}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-primary/30 transition-all rounded-xl h-11"
          asChild
        >
          <a href={game.link} target="_blank" rel="noopener noreferrer">
            <Play className="mr-2 h-4 w-4 fill-current" /> Play
          </a>
        </Button>
        <a
          href={game.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${game.title} in a new tab`}
          className="p-3 text-muted-foreground hover:text-primary bg-secondary/5 rounded-xl transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    </CardContent>
  </Card>
);

const allGenres = ['All', ...Array.from(new Set(games.map(g => g.genre)))];
const allTags = ['All', 'Calm', 'Focus', 'Quick', 'Strategy', 'Competitive', 'Action', 'Social', 'Joyful', 'Nostalgia', 'Calm_Casual', 'Shooter', 'Racing', 'Arcade', 'Puzzle'];
const playtimeOptions = [
    { value: 'all', label: 'All' },
    { value: '2', label: '≤ 2 min' },
    { value: '5', label: '≤ 5 min' },
    { value: '10', label: '≤ 10 min' },
    { value: '10+', label: '> 10 min' },
];

function GamesPageContent() {
    const [genre, setGenre] = useState('All');
    const [tag, setTag] = useState('All');
    const [playtime, setPlaytime] = useState('all');
    const [sort, setSort] = useState('recommended');


  const filteredGames = useMemo(() => {
    let filtered = games;

    if (genre !== 'All') {
      filtered = filtered.filter(game => game.genre === genre);
    }
    if (tag !== 'All') {
      filtered = filtered.filter(game => game.tags.includes(tag));
    }
    if (playtime !== 'all') {
        if (playtime === '10+') {
            filtered = filtered.filter(game => game.playtime > 10);
        } else {
            filtered = filtered.filter(game => game.playtime <= parseInt(playtime, 10));
        }
    }

    switch (sort) {
      case 'mostPlayed':
        return filtered.sort((a, b) => (b.mostPlayed ? 1 : -1));
      case 'newest':
        return filtered.sort((a, b) => (b.newest ? 1 : -1));
      case 'recommended':
      default:
        return filtered.sort((a, b) => (b.recommended ? 1 : -1));
    }
  }, [genre, tag, playtime, sort]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-transparent">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/home">
              <ArrowLeft />
            </Link>
          </Button>
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Games
          </h1>
        </div>
      </header>

      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
              Genre
            </label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-full bg-card border-none shadow-sm rounded-xl h-12 font-medium">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                {allGenres.map(genre => (
                  <SelectItem key={genre} value={genre} className="font-medium rounded-lg hover:bg-primary/10">
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
              Tag
            </label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger className="w-full bg-card border-none shadow-sm rounded-xl h-12 font-medium">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag} className="font-medium rounded-lg hover:bg-primary/10">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
              Playtime
            </label>
            <Select value={playtime} onValueChange={setPlaytime}>
              <SelectTrigger className="w-full bg-card border-none shadow-sm rounded-xl h-12 font-medium">
                <SelectValue placeholder="Select playtime" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                {playtimeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="font-medium rounded-lg hover:bg-primary/10">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
              Sort By
            </label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full bg-primary text-primary-foreground border-none shadow-md rounded-xl h-12 font-bold">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="recommended" className="font-medium rounded-lg">Recommended</SelectItem>
                <SelectItem value="newest" className="font-medium rounded-lg">Newest</SelectItem>
                <SelectItem value="mostPlayed" className="font-medium rounded-lg">Most Played</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <main className="flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map(game => (
              <GameCard key={game.title} game={game} />
            ))}
             {filteredGames.length === 0 && (
                <div className="col-span-full text-center py-16">
                    <p className="text-lg text-muted-foreground">No games match your filters.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <AuthGuard>
      <GamesPageContent />
    </AuthGuard>
  );
}
