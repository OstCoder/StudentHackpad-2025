import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { ResourceCard } from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Resource } from '@/types/task';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const handleAddResource = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    const newResource: Resource = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl,
      notes: '',
    };
    
    setResources([...resources, newResource]);
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };
  
  const handleUpdateNotes = (id: string, notes: string) => {
    setResources(resources.map(r =>
      r.id === id ? { ...r, notes } : r
    ));
  };
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          ) : (
            <Card className="p-4 glass animate-pop">
              <div className="space-y-3">
                <Input
                  placeholder="Resource title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  placeholder="Video URL (YouTube embed link)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddResource} className="flex-1 bg-gradient-primary">
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {resources.length === 0 ? (
          <Card className="p-8 glass text-center">
            <p className="text-muted-foreground">
              No resources yet. Add your first learning resource!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
