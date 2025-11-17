import { useState } from 'react';
import { Smile, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MoodEnergyTrackerProps {
  mood: number;
  energy: number;
  onUpdate: (mood: number, energy: number) => void;
}

const moodEmojis = ['😫', '😟', '😐', '🙂', '😊', '😄', '🤩', '🥳', '🌟', '✨'];

export const MoodEnergyTracker = ({ mood, energy, onUpdate }: MoodEnergyTrackerProps) => {
  const [tempMood, setTempMood] = useState(mood);
  const [tempEnergy, setTempEnergy] = useState(energy);
  const [burstEmojis, setBurstEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  
  const handleSave = () => {
    onUpdate(tempMood, tempEnergy);
    
    // Trigger emoji burst animation
    const emojis = [
      moodEmojis[Math.floor((tempMood - 1) / 1)],
      moodEmojis[Math.floor((tempEnergy - 1) / 1)],
    ];
    
    const newBurstEmojis = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: 20 + i * 30,
    }));
    
    setBurstEmojis(newBurstEmojis);
    
    setTimeout(() => {
      setBurstEmojis([]);
    }, 600);
  };
  
  return (
    <Card className="p-6 glass relative overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-primary" />
        How are you feeling?
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Mood</span>
            <span className="text-2xl">{moodEmojis[Math.floor((tempMood - 1) / 1)]}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={tempMood}
            onChange={(e) => setTempMood(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Energy</span>
            <Zap className="w-5 h-5 text-accent" />
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={tempEnergy}
            onChange={(e) => setTempEnergy(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Drained</span>
            <span>Energized</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
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
