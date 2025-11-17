import { Brain, TreePine, BookText } from 'lucide-react';

interface StudyPulseNavProps {
  activeTab: 'dashboard' | 'focus' | 'notes';
  onTabChange: (tab: 'dashboard' | 'focus' | 'notes') => void;
}

export const StudyPulseNav = ({ activeTab, onTabChange }: StudyPulseNavProps) => {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Brain },
    { id: 'focus' as const, label: 'Focus Garden', icon: TreePine },
    { id: 'notes' as const, label: 'Notes', icon: BookText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              StudyPulse
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                  transition-all duration-300 ease-out
                  ${
                    activeTab === tab.id
                      ? 'bg-card text-primary shadow-md scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
