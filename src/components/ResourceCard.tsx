import { useState } from 'react';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Edit3, Save } from 'lucide-react';
import { Resource } from '@/types/task';

interface ResourceCardProps {
  resource: Resource;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const ResourceCard = ({ resource, onUpdateNotes }: ResourceCardProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(resource.notes);
  
  const handleSaveNotes = () => {
    onUpdateNotes(resource.id, notes);
    setIsEditingNotes(false);
  };
  
  return (
    <Card className="p-4 glass animate-pop">
      <h4 className="font-semibold mb-3">{resource.title}</h4>
      
      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
        <iframe
          src={resource.url}
          className="w-full h-full"
          title={resource.title}
          allowFullScreen
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Notes</label>
          {!isEditingNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingNotes(true)}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this resource..."
              className="min-h-20"
            />
            <Button
              size="sm"
              onClick={handleSaveNotes}
              className="w-full bg-gradient-primary"
            >
              <Save className="w-3 h-3 mr-2" />
              Save Notes
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {notes || 'No notes yet. Click edit to add notes.'}
          </p>
        )}
      </div>
    </Card>
  );
};
