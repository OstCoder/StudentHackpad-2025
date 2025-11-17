import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Note, Resource } from '@/types/studypulse';
import { DrawingCanvas } from './DrawingCanvas';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Omit<Note, 'id' | 'createdAt'> & { id?: string }) => void;
  onClose: () => void;
}

export const NoteEditor = ({ note, onSave, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [resources, setResources] = useState<Resource[]>(note?.resources || []);
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [drawingData, setDrawingData] = useState(note?.drawingData || '');

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: note?.id,
      title,
      content,
      resources,
      drawingData,
      updatedAt: new Date().toISOString(),
    });
  };

  const addResource = () => {
    if (!newResourceUrl.trim()) return;

    const newResource: Resource = {
      id: Date.now().toString(),
      url: newResourceUrl,
      note: '',
    };

    setResources([...resources, newResource]);
    setNewResourceUrl('');
  };

  const updateResourceNote = (id: string, note: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, note } : r));
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 glass border-2 border-primary/20">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Note Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="bg-background/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              className="bg-background/50 min-h-32"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-gradient-primary shadow-md">
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 glass border-2 border-primary/20">
        <h3 className="font-semibold mb-4">Resources</h3>

        <div className="flex gap-2 mb-4">
          <Input
            value={newResourceUrl}
            onChange={(e) => setNewResourceUrl(e.target.value)}
            placeholder="Paste resource URL..."
            className="bg-background/50"
          />
          <Button onClick={addResource} className="bg-gradient-primary shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-4 bg-background/50 animate-pop">
              {isYouTubeUrl(resource.url) ? (
                <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={getYouTubeEmbedUrl(resource.url)}
                    className="w-full h-full"
                    title="Video"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mb-3 break-all"
                >
                  {resource.url}
                </a>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Edit3 className="w-3 h-3" />
                  Note about this resource
                </label>
                <Textarea
                  value={resource.note}
                  onChange={(e) => updateResourceNote(resource.id, e.target.value)}
                  placeholder="What is this resource about?"
                  className="bg-background/30 min-h-20"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteResource(resource.id)}
                className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <DrawingCanvas
        initialData={drawingData}
        onSave={setDrawingData}
      />
    </div>
  );
};
