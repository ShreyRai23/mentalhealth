
'use client';
import { useState } from 'react';
import {
  User,
  Pencil,
  Download,
  Trash2,
  Calendar,
  BarChart2,
  ThumbsUp,
  Save,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useProfile } from '@/context/profile-context';
import { useAuth } from '@/context/auth-context';
import AuthGuard from '@/components/auth-guard';
import { useMood } from '@/context/mood-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const StatCard = ({
  value,
  label,
  icon: Icon,
  colorClass = 'text-primary bg-primary/10',
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  colorClass?: string;
}) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className={cn("relative p-3 rounded-full mb-3", colorClass)}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-3xl font-black text-foreground">{value}</p>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
  </div>
);

const allInterests = ['Reading', 'Music', 'Exercise', 'Cooking', 'Gaming', 'Art', 'Travel', 'Movies', 'Sports', 'Writing', 'Yoga', 'Photography'];
const allStressors = ['Deadlines', 'Work', 'School', 'Health', 'Money', 'Family', 'Social', 'Relationships', 'Future', 'Commute'];


const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
    <p className="text-gray-500">{label}</p>
    <div className="font-medium text-gray-800 text-right">{value}</div>
  </div>
);

const EditableInfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <p className="text-gray-500">{label}</p>
    <div className="w-1/2">{children}</div>
  </div>
);

const TagButton = ({
  label,
  variant = 'default',
  isSelected,
  onClick,
  isEditing,
}: {
  label: string;
  variant?: 'default' | 'destructive';
  isSelected?: boolean;
  onClick?: () => void;
  isEditing?: boolean;
}) => (
  <Badge
    onClick={onClick}
    className={cn(
      'rounded-full px-4 py-1.5 text-sm font-semibold border-none shadow-sm transition-all',
      isEditing && 'cursor-pointer hover:scale-105',
      isSelected
        ? variant === 'destructive'
          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
        : variant === 'destructive'
        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
        : 'bg-primary/10 text-primary hover:bg-primary/20',
    )}
  >
    {label}
  </Badge>
);

function ProfilePageContent() {
  const { profileData, setProfileData, resetProfile } = useProfile();
  const { user, logout } = useAuth();
  const { moods, clearMoods } = useMood();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      await setProfileData(tempProfileData);
    } else {
      // Start editing
      setTempProfileData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setTempProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (
    field: 'interests' | 'stressors',
    tag: string
  ) => {
    const currentTags = tempProfileData[field];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setTempProfileData(prev => ({ ...prev, [field]: newTags }));
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: profileData,
      moods: moods,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindwell_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    await Promise.all([resetProfile(), clearMoods()]);
    // Also reset temp data if editing
    setTempProfileData({
      name: user?.name || 'User',
      age: 0,
      gender: 'Prefer not to say',
      country: '',
      sleepHours: 8,
      interests: [],
      stressors: [],
    });
  };


  const currentData = isEditing ? tempProfileData : profileData;
  const profile = profileData;

  return (
    <div className="max-w-5xl mx-auto p-8 md:p-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground font-headline">Profile</h1>
        <p className="text-sm font-medium text-muted-foreground flex items-center">
          Good morning, {profile?.name || user?.name || 'User'}! <span className="ml-2 text-xl">👋</span>
        </p>
      </div>

      {/* Header Card */}
      <Card className="bg-card border-none shadow-lg rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black font-headline">
                  {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-foreground font-headline">
                  {isEditing ? (
                    <Input
                      value={tempProfileData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    profile?.name || user?.name || 'User'
                  )}
                </h2>
                <p className="text-muted-foreground font-medium mb-1">
                  {profile?.age ? `${profile.age} years old` : 'Age not set'}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl font-bold px-6"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="flex-1 md:flex-none border-primary text-primary hover:bg-primary/10 rounded-xl font-bold px-6"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl font-bold px-6"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="flex-1 md:flex-none shadow-md rounded-xl font-bold px-6 bg-destructive hover:bg-destructive/90"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border/50">
            <StatCard icon={Calendar} value={moods.length.toString()} label="Days Logged" colorClass="text-primary bg-primary/10" />
            <StatCard icon={BarChart2} value={`${(moods.reduce((acc, m) => acc + (m.score || 0), 0) / (moods.length || 1)).toFixed(1)}/10`} label="Average Mood" colorClass="text-secondary bg-secondary/10" />
            <StatCard icon={ThumbsUp} value="2" label="Activities Completed" colorClass="text-accent bg-accent/10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="bg-card border-none shadow-lg rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
          <CardHeader className="pt-8">
            <CardTitle className="text-xl font-bold text-foreground font-headline uppercase tracking-wide">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <>
                <EditableInfoRow label="Age">
                  <Input
                    type="number"
                    value={tempProfileData.age}
                    onChange={e =>
                      handleInputChange('age', parseInt(e.target.value) || 0)
                    }
                  />
                </EditableInfoRow>
                <EditableInfoRow label="Gender">
                  <Select
                    value={tempProfileData.gender}
                    onValueChange={value => handleInputChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </EditableInfoRow>
                <EditableInfoRow label="Country">
                  <Input
                    value={tempProfileData.country}
                    onChange={e =>
                      handleInputChange('country', e.target.value)
                    }
                  />
                </EditableInfoRow>
                <EditableInfoRow label="Sleep Hours">
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[tempProfileData.sleepHours]}
                      onValueChange={([value]) =>
                        handleInputChange('sleepHours', value)
                      }
                      max={12}
                      step={1}
                    />
                    <span className="w-12 text-right">
                      {tempProfileData.sleepHours}h
                    </span>
                  </div>
                </EditableInfoRow>
              </>
            ) : (
              <>
                <InfoRow label="Age" value={profileData.age > 0 ? `${profileData.age} years old` : 'Not set'} />
                <InfoRow label="Gender" value={profileData.gender || 'Not set'} />
                <InfoRow label="Country" value={profileData.country || 'Not set'} />
                <InfoRow
                  label="Sleep Hours"
                  value={`${profileData.sleepHours} hours / night`}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="bg-card border-none shadow-lg rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary"></div>
          <CardHeader className="pt-8">
            <CardTitle className="text-xl font-bold text-foreground font-headline uppercase tracking-wide">
              Interests
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(isEditing ? allInterests : profileData.interests).map(interest => (
              <TagButton
                key={interest}
                label={interest}
                isEditing={isEditing}
                isSelected={currentData.interests.includes(interest)}
                onClick={
                  isEditing
                    ? () => handleTagToggle('interests', interest)
                    : undefined
                }
              />
            ))}
             {!isEditing && profileData.interests.length === 0 && (
              <p className="text-muted-foreground text-sm">No interests selected.</p>
            )}
          </CardContent>
        </Card>

        {/* Common Stressors */}
        <Card className="bg-card border-none shadow-lg rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive"></div>
          <CardHeader className="pt-8">
            <CardTitle className="text-xl font-bold text-foreground font-headline uppercase tracking-wide">
              Common Stressors
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(isEditing ? allStressors : profileData.stressors).map(stressor => (
              <TagButton
                key={stressor}
                label={stressor}
                variant="destructive"
                isEditing={isEditing}
                isSelected={currentData.stressors.includes(stressor)}
                onClick={
                  isEditing
                    ? () => handleTagToggle('stressors', stressor)
                    : undefined
                }
              />
            ))}
             {!isEditing && profileData.stressors.length === 0 && (
              <p className="text-muted-foreground text-sm">No stressors selected.</p>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-card border-none shadow-lg rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
          <CardHeader className="pt-8">
            <CardTitle className="text-xl font-bold text-foreground font-headline uppercase tracking-wide">
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <Button variant="outline" className="w-full justify-start rounded-xl h-12 border-primary/20 text-primary hover:bg-primary/10 transition-all hover:scale-[1.02]" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" /> Export My Data (JSON)
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start rounded-xl h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all hover:scale-[1.02] shadow-md"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    profile and mood data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
