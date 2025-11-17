import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { Drawing } from '@/types/task';
import { Card } from '@/components/ui/card';

const FocusGarden = () => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  
  const handleSaveDrawing = (dataUrl: string) => {
    const newDrawing: Drawing = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date(),
    };
    setDrawings([newDrawing, ...drawings]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DrawingCanvas onSave={handleSaveDrawing} />
            
            {drawings.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Saved Drawings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {drawings.map((drawing) => (
                    <Card key={drawing.id} className="p-4 glass">
                      <img
                        src={drawing.dataUrl}
                        alt="Saved drawing"
                        className="w-full rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {drawing.timestamp.toLocaleString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <PomodoroTimer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FocusGarden;
