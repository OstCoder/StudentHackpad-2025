import { useState } from 'react';
import { Smile, Zap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMoodLabel } from '@/utils/taskLogic';

interface MoodEnergyTrackerProps {
  mood: number;
  energy: number;
  onUpdate: (mood: number, energy: number) => void;
}

export const MoodEnergyTracker = ({ mood, energy, onUpdate }: MoodEnergyTrackerProps) => {
  const [tempMood, setTempMood] = useState(mood);
  const [tempEnergy, setTempEnergy] = useState(energy);
  const [burstEmojis, setBurstEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const moodData = getMoodLabel(tempMood);

  const handleSave = () => {
    onUpdate(tempMood, tempEnergy);

    // Emoji burst animation
    const emojis = [moodData.emoji, '⚡'];
    const newBurstEmojis = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: 30 + i * 40,
    }));

    setBurstEmojis(newBurstEmojis);
    setTimeout(() => setBurstEmojis([]), 600);
  };

  return (
    <Card className="p-6 glass relative overflow-hidden border-2 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-primary" />
        How are you feeling?
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Mood</span>
            <span className="text-2xl flex items-center gap-2">
              {moodData.emoji}
              <span className="text-sm text-muted-foreground">{moodData.label}</span>
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={tempMood}
            onChange={(e) => setTempMood(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span className="font-medium text-primary">{tempMood}</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Energy</span>
            <Zap className="w-5 h-5 text-accent" />
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={tempEnergy}
            onChange={(e) => setTempEnergy(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span className="font-medium text-primary">{tempEnergy}</span>
            <span>100</span>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {burstEmojis.map((burst) => (
        <div
          key={burst.id}
          className="absolute text-4xl animate-emoji-burst pointer-events-none"
          style={{ left: `${burst.x}%`, top: '50%' }}
        >
          {burst.emoji}
        </div>
      ))}
    </Card>
  );
};
